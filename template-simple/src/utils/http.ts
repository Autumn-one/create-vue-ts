import { code_map } from '@/consts/error_code';
import { timeout } from '@/consts/sys_config';
import axios, { type AxiosRequestConfig } from 'axios';
import { type Axios } from 'axios';
import Cookies from 'js-cookie';


type AsyncTryReturn = [ boolean, any, 'async_try' ];

type AsyncTryReturnInfer<T> = T extends Promise<any> ? Promise<AsyncTryReturn> : AsyncTryReturn;

function async_try<T>( ps: T ): AsyncTryReturnInfer<T>
{
    if ( ps instanceof Promise )
    {
        return ps.then( res =>
        {
            if ( Array.isArray( res ) && res.length >= 3 && res[2] === 'async_try' )
            {
                return res as AsyncTryReturn;
            }
            return [ true, res, 'async_try' ] as AsyncTryReturn;
        } )
            .catch( err =>
            {
                return [ false, err, 'async_try' ] as AsyncTryReturn;
            } ) as AsyncTryReturnInfer<T>;
    }

    return [ true, ps, 'async_try' ] as AsyncTryReturnInfer<T>;
}


const instance = axios.create( {
    baseURL: import.meta.env.VITE_DOMAIN,
    // headers: {
    //
    // },
    timeout, // 请求的超时时间
    transformRequest: [
        function( data, headers )
        {
            // 对发送的 data 进行任意转换处理
            return data;
        },
    ],
} );

// 添加请求拦截器
instance.interceptors.request.use(
    function( config: any )
    {
        const token = Cookies.get( 'token' );
        if ( token )
        {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        if ( config.method === 'post' && config.data )
        {
            if ( config.data?.cancelToken )
            {
                config.cancelToken = config.data.cancelToken;
                delete config.data.cancelToken;
            }
            config.headers['Content-type'] = 'application/x-www-form-urlencode';
            const form_data = new FormData();
            Object.keys( config.data ).forEach( k =>
            {
                form_data.set( k, config.data[k] );
            } );
            config.data = form_data;
        }

        return config;
    },
    function( error )
    {
        // 对请求错误做些什么
        return Promise.reject( error );
    },
);

// 添加响应拦截器
instance.interceptors.response.use(
    function( response )
    {
        if ( response?.config?.responseType === 'blob' ) return async_try( response.data ) as any;
        if ( response.status == 200 && response.data && response.data.code === 0 )
        {
            const response_data: any = response.data;
            response_data._origin = response;
            return async_try( response_data );
        }
        else
        {
            const code = get( response, 'data.code', '==' );
            const code_msg = code_map['code_' + code];
            if ( [ 15, 16 ].includes( code ) )
            {
                const white_list_arr = [ '#/reset', '#/reset-2FA', '#/register', '#/login' ];
                console.log( location.hash );
                if ( !white_list_arr.some( item => location.hash.startsWith( item ) ) )
                {
                    if ( !location.hash.startsWith( '#/' ) )
                    {
                        ( response.config.err_message !== false )
                            && message( '当前未登录，将跳转到登录！', 'info', 1000 );
                    }

                    Emitter.sender( EM_AxiosNotLogin_Login, true );
                    location.href = '#/login';
                }
            }
            else
            {
                ( response.config.err_message !== false ) && message( {
                    message: get( response, 'data.message', false ) || code_msg,
                    type: 'error',
                } );
            }

            const reject_data: any = response.data;
            reject_data._origin = response;
            return async_try( Promise.reject( reject_data ) );
        }
    },
    function( error )
    {
        // 对响应错误做点什么
        if ( error.code === 'ERR_NETWORK' )
        {
            ( error.config.err_message !== false )
                && message( '网络错误！请检查您的网络或网络代理！', 'error', 2500 );
        }
        else if ( error.code === 'ECONNABORTED' )
        {
            ( error.config.err_message !== false ) && message( '网络请求超时！建议检查网络或重试！', 'error', 2500 );
        }
        else if ( error.code === 'ERR_BAD_REQUEST' )
        {
            ( error.config.err_message !== false ) && message( '当前访问的服务不存在！', 'error', 2500 );
        }
        else if ( error.code === 'ERR_CANCELED' )
        {
            error.is_cancel = true;
        }
        else
        {
            ( error.config?.err_message !== false ) && message( error.message, 'error', 2500 );
        }
        return async_try( Promise.reject( error ) );
    },
);

const axios_get = instance.get;

const axios_post = instance.post;

instance.get = function( url: string, config: AxiosRequestConfig<any>, can_cancel: boolean = false )
{
    url = url.startsWith( '/' ) ? url.trim() : `/${url}`.trim();
    if ( !is_auth( url ) )
    {
        console.log( '无权访问的url:' );
        console.log( url );
        msg( `无权访问的URL:${url}`, 'error' );
        return can_cancel
            ? [ Promise.resolve( [ false, '无权访问', 'async_try' ] ), { cancel: () => '' } ]
            : Promise.resolve( [ false, '无权访问', 'async_try' ] );
    }
    if ( !can_cancel )
    {
        return axios_get( url, config ) as any;
    }

    const controller = new AbortController();

    return [
        axios_get( url, { ...config, signal: controller.signal } ),
        {
            cancel: ( ...args: any[] ) => controller.abort( ...args ),
        },
    ] as any;
};

instance.post = function( url: string, params: any, config: AxiosRequestConfig<any> = {}, can_cancel: boolean = false )
{
    url = url.startsWith( '/' ) ? url.trim() : `/${url}`.trim();
    if ( !is_auth( url ) )
    {
        // if ( __debug__ )
        // {
        //     console.log( '无权访问的url:' );
        //     console.log( url );
        // }
        console.log( '无权访问的url:' );
        console.log( url );
        msg( `无权访问的URL:${url}`, 'error' );
        return can_cancel
            ? [ Promise.resolve( [ false, '无权访问', 'async_try' ] ), { cancel: () => '' } ]
            : Promise.resolve( [ false, '无权访问', 'async_try' ] );
    }
    if ( !can_cancel )
    {
        return axios_post( url, params, config ) as any;
    }
    const controller = new AbortController();
    return [
        axios_post( url, params, { ...config, signal: controller.signal } ),
        {
            cancel: ( ...args: any[] ) => controller.abort( ...args ),
        },
    ] as any;
};

export { instance as http };
