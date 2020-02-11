#!/usr/bin/env node
/**
 * @fileOverview 可执行文件入口
 * @author <a href='https://github.com/OrangeX4/'>OrangeX4</a>
 * @version 0.1
 */
// const childProcess = require('child_process');
const Path = require('path');
const fs = require('fs');
const minimist = require('minimist');

const argv = minimist(process.argv);
console.log('控制台目录:');
console.log(process.cwd());
console.log('命令行参数:');
console.log(argv);

const index = require('../dist/main.js');

function updateDict() {
    console.log('正在更新字典文件, 请稍等一会:)');
    index.readDictFileByGithubRelease('https://api.github.com/repos/Orangex4/Orangex/releases/latest').then((dict) => {
        fs.writeFile(`${Path.dirname(argv._[1])}/dict.json`, dict, (err) => {
            if (err) console.log('读取最新字典失败!');
            else console.log('读取最新字典成功!');
        });
    });
}

// 判断字典文件是否存在, 不存在就执行updateDict, 存在就进一步判断
fs.exists(`${Path.dirname(argv._[1])}/dict.json`, (isExist) => {
    if (isExist) {
        if (argv._[2]) {
            switch (argv._[2]) {
                case '帮助':
                    console.log('帮助信息: 使用"橙式 测试"开始测试.');
                    break;
                case '测试':
                    index.test();
                    break;
                case '更新字典':
                    updateDict();
                    break;
                case '英转汉':
                    index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, true, argv.深);
                    break;
                case '汉转英':
                    index.translaterFileTree(Path.normalize(process.cwd()), `${Path.dirname(argv._[1])}/dict.json`, false, argv.深);
                    break;
                default:
                    console.log(`未找到命令'${argv._[2]}'`);
                }
            } else {
                console.log('使用"橙式 帮助"命令可获取帮助信息:)');
        }
    } else {
        // 更新字典
        updateDict();
    }
});
