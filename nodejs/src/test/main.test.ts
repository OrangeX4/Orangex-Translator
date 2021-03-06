import * as replacer from '../lib/replacer';
import * as utils from '../lib/utils';
// import * as fileReplacer from '../lib/fileReplacer';

export default function start() {
    const str = 'jsx js  default if  ddd ￥中文注释￥ 1数字-Head $';

    function testFunc(dict: string) {
        replacer.setSplit('￥'); // ￥
        const dictionary = JSON.parse(dict);
        const mergeDict = dictionary.common;
        // console.log('mergeDict:');
        // console.log(mergeDict);
        const returnObject = replacer.replaceWithSplit(str, mergeDict);
        console.log('All:');
        console.log(returnObject);
        // console.log('Array content:');
        // console.log(returnObject.returnArray[0]);
        console.log('Content:');
        console.log(returnObject.content);
        console.log('Translater:');
        console.log(replacer.replaceWithSplit(returnObject.content,
            replacer.turnDict(mergeDict)).content);

        // fileReplacer.translateFile('D:/project/Orangex/nodejs/src/test/test.txt',
            // 'D:/project/Orangex/nodejs/src/test/test.txt.orz', mergeDict);
        // fileReplacer.translaterFileTreeWithExtname(
            // 'D:/project/Orangex/nodejs/src/test', mergeDict);
    }
    // utils.readWithWebAndRedirect(testFunc);
    utils.readWithWebAndRedirect().then(testFunc);
    // utils.readFile('D:/project/Orangex/map/dict.json').then((testFunc));
    // const testDict = {
    //     a: '1',
    //     b: '2',
    //     c: '3',
    //     d: '5',
    //     e: '6',
    // };
    // console.log('Merge:');
    // console.log(replacer.mergeDict({
    //     a: '1',
    //     b: '2',
    //     c: '3',
    // }, {
    //     c: '4',
    //     d: '5',
    //     e: '6',
    // }));
    // console.log('Turn:');
    // console.log(replacer.turnDict(testDict));
    // // eslint-disable-next-line no-new
    // new Promise(utils.explorer()).then((data) => {
    //     console.log('File imformation:');
    //     console.log(data);
    // });
}
