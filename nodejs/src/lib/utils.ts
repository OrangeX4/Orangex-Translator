/**
 * @fileOverview 工具函数库
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
import * as fs from 'fs';
import * as nodefetch from 'node-fetch';
import * as jschardet from 'jschardet';
// import util from 'util';

export interface DetectedMap {
    filename: string,
    encoding: string,
    confidence: number
}

/**
 * @description 读取文件
 * @param {string} url URL,即文件的路径
 * @return {Promise <string>} 返回一个Promise
 */
export function readFile(url: string): Promise < string > {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', (err, data) => {
            // console.log('读取文件:-------------------------------------');
            // console.log(data);
            if (err) reject(err);
            // const str = data.toString(jschardet.detect(data).encoding);
            resolve(data);
        });
    });
}
/**
 * @description 写入文件
 * @param {string} url URL,即文件的路径
 * @param {string} content 写入的内容
 * @return {Promise <string>} 返回一个Promise
 */
export function writeFile(url: string, content: string): Promise < void > {
    return new Promise((resolve, reject) => {
        fs.writeFile(url, content, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
/**
 * @description 获取文件夹内文件信息
 * @param {string} path 文件夹的路径
 * @param {boolean} isDeep 是否进入到子目录
 * @return {Promise <DetectedMap[]>} 返回一个Promise
 * 可传入PromiseFunc().then((data)=>{})中调用,其中data是DetectedMap[]格式的
 */
export function explorer(path:string, isDeep: boolean):Promise <DetectedMap[]> {
    return new Promise((resolve, reject) => {
        const data: DetectedMap[] = [];
        fs.readdir(path, (err, files) => {
            // err 为错误 , files 文件名列表包含文件夹与文件
            if (err) {
                reject(err);
                return;
            }
            Promise.all(files.map((file) => new Promise(((newResolve, newReject) => {
                    fs.stat(`${path}/${file}`, (erro, stat) => {
                        if (erro) {
                            newReject();
                            return;
                        }
                        if (stat.isDirectory()) {
                            // 如果是文件夹遍历且有深度遍历选项的话就递归调用
                            // explorer(`${path}/${file}`);
                            if (isDeep) {
                            explorer(`${path}/${file}`, isDeep).then((newData) => {
                                data.push(...newData);
                                newResolve();
                            });
                            } else newResolve();
                        } else {
                            // 读出所有的文件
                            const str = fs.readFileSync(`${path}/${file}`);
                            const result = jschardet.detect(str);
                            const item: DetectedMap = { filename: `${path}/${file}`, encoding: result.encoding, confidence: result.confidence };

                            // console.log(`编码方式:${result.encoding}; 可信度:${result.confidence}`);
                            // console.log(`文件名:${path}/${file}`);
                            data.push(item);
                            newResolve();
                        }
                    });
                })))).then(() => {
                    resolve(data);
              });
        });
    });
}
/**
 * @description 通过网络下载文件
 * @param {String} path 保存路径
 * @param {String} url 网页地址,默认为'https://api.github.com/repos/Orangex4/Orangex/releases/latest'
 */
export function downloadWithWeb(path: string,
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    nodefetch.default(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    }).then((res: nodefetch.Response) => res.buffer()).then((_buffer: Buffer) => {
        fs.writeFile(path, _buffer, 'binary', (error:Error | null) => {
        console.log(error);
      });
        // callback(_buffer.toString('utf8'));
    });
}

/**
 * @description 通过网络读取内容
 * @param {string} url 网页地址
 * @return {Promise <string> } 返回一个Promise,用then调用后传入读取内容
 */
export function readWithWeb(
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest'): Promise <string> {
    return nodefetch.default(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    }).then((value: nodefetch.Response) => value.buffer())
    .then((_buffer: Buffer) => _buffer.toString());
}
/**
 * @description 通过网络下载Github Release的文件
 * @param {String} path 保存路径
 * @param {String} url Github Release的地址,默认'https://api.github.com/repos/Orangex4/Orangex/releases/latest'
 */
export function downloadWithWebAndRedirect(path: string,
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest') {
    readWithWeb(url).then((html: string) => {
        // console.log('html:-------------------------------------');
        // console.log(html);
        const jsonObject = JSON.parse(html);
        const fileUrl = jsonObject.assets[0].browser_download_url;
        // console.log(fileUrl);
        downloadWithWeb(path, fileUrl);
    });
}

/**
 * @description 通过网络读取Github Release的文件
 * @param {String} url 网页地址，形如'https://api.github.com/repos/Orangex4/Orangex/releases/latest'
 * @return {Promise < string >} 返回一个Promise,用then调用后传入读取到的文本
 */
export function readWithWebAndRedirect(
    url: string = 'https://api.github.com/repos/Orangex4/Orangex/releases/latest'): Promise < string > {
    return readWithWeb(url).then((html: string) => {
        const jsonObject = JSON.parse(html);
        const fileUrl = jsonObject.assets[0].browser_download_url;
        return readWithWeb(fileUrl);
    });
}
