export default class HTMLParser {
    typeHtmlChars(curString, curStrPos, self) {
        if (self.contentType !== 'html')
            return curStrPos;
        const curChar = curString.substring(curStrPos).charAt(0);
        if (curChar === '<' || curChar === '&') {
            let endTag = '';
            if (curChar === '<') {
                endTag = '>';
            }
            else {
                endTag = ';';
            }
            while (curString.substring(curStrPos + 1).charAt(0) !== endTag) {
                curStrPos++;
                if (curStrPos + 1 > curString.length) {
                    break;
                }
            }
            curStrPos++;
        }
        return curStrPos;
    }
    backSpaceHtmlChars(curString, curStrPos, self) {
        if (self.contentType !== 'html')
            return curStrPos;
        const curChar = curString.substring(curStrPos).charAt(0);
        if (curChar === '>' || curChar === ';') {
            let endTag = '';
            if (curChar === '>') {
                endTag = '<';
            }
            else {
                endTag = '&';
            }
            while (curString.substring(curStrPos - 1).charAt(0) !== endTag) {
                curStrPos--;
                if (curStrPos < 0) {
                    break;
                }
            }
            curStrPos--;
        }
        return curStrPos;
    }
}
export let htmlParser = new HTMLParser();
