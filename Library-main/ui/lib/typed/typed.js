import { initializer } from './initializer.js';
import { htmlParser } from './html-parser.js';
export default class Typed {
    constructor(elementId, options) {
        initializer.load(this, options, elementId);
        this.begin();
    }
    toggle() {
        this.pause.status ? this.start() : this.stop();
    }
    stop() {
        if (this.typingComplete)
            return;
        if (this.pause.status)
            return;
        this.toggleBlinking(true);
        this.pause.status = true;
        this.options.onStop(this.arrayPos, this);
    }
    start() {
        if (this.typingComplete)
            return;
        if (!this.pause.status)
            return;
        this.pause.status = false;
        if (this.pause.typewrite) {
            this.typewrite(this.pause.curString, this.pause.curStrPos);
        }
        else {
            this.backspace(this.pause.curString, this.pause.curStrPos);
        }
        this.options.onStart(this.arrayPos, this);
    }
    destroy() {
        this.reset(false);
        this.options.onDestroy(this);
    }
    reset(restart = true) {
        clearInterval(this.timeout);
        this.replaceText('');
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
            this.cursor = null;
        }
        this.strPos = 0;
        this.arrayPos = 0;
        this.curLoop = 0;
        if (restart) {
            this.insertCursor();
            this.options.onReset(this);
            this.begin();
        }
    }
    begin() {
        this.options.onBegin(this);
        this.typingComplete = false;
        this.shuffleStringsIfNeeded(this);
        this.insertCursor();
        if (this.bindInputFocusEvents)
            this.bindFocusEvents();
        this.timeout = setTimeout(() => {
            if (this.strPos === 0) {
                this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
            }
            else {
                this.backspace(this.strings[this.sequence[this.arrayPos]], this.strPos);
            }
        }, this.startDelay);
    }
    typewrite(curString, curStrPos) {
        if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
            this.el.classList.remove(this.fadeOutClass);
            if (this.cursor)
                this.cursor.classList.remove(this.fadeOutClass);
        }
        const humanize = this.humanizer(this.typeSpeed);
        let numChars = 1;
        if (this.pause.status === true) {
            this.setPauseStatus(curString, curStrPos, true);
            return;
        }
        this.timeout = setTimeout(() => {
            curStrPos = htmlParser.typeHtmlChars(curString, curStrPos, this);
            let pauseTime = 0;
            let substr = curString.substring(curStrPos);
            if (substr.charAt(0) === '^') {
                if (/^\^\d+/.test(substr)) {
                    let skip = 1;
                    substr = /\d+/.exec(substr)[0];
                    skip += substr.length;
                    pauseTime = parseInt(substr);
                    this.temporaryPause = true;
                    this.options.onTypingPaused(this.arrayPos, this);
                    curString =
                        curString.substring(0, curStrPos) +
                            curString.substring(curStrPos + skip);
                    this.toggleBlinking(true);
                }
            }
            if (substr.charAt(0) === '`') {
                while (curString.substring(curStrPos + numChars).charAt(0) !== '`') {
                    numChars++;
                    if (curStrPos + numChars > curString.length)
                        break;
                }
                const stringBeforeSkip = curString.substring(0, curStrPos);
                const stringSkipped = curString.substring(stringBeforeSkip.length + 1, curStrPos + numChars);
                const stringAfterSkip = curString.substring(curStrPos + numChars + 1);
                curString = stringBeforeSkip + stringSkipped + stringAfterSkip;
                numChars--;
            }
            this.timeout = setTimeout(() => {
                this.toggleBlinking(false);
                if (curStrPos >= curString.length) {
                    this.doneTyping(curString, curStrPos);
                }
                else {
                    this.keepTyping(curString, curStrPos, numChars);
                }
                if (this.temporaryPause) {
                    this.temporaryPause = false;
                    this.options.onTypingResumed(this.arrayPos, this);
                }
            }, pauseTime);
        }, humanize);
    }
    keepTyping(curString, curStrPos, numChars) {
        if (curStrPos === 0) {
            this.toggleBlinking(false);
            this.options.preStringTyped(this.arrayPos, this);
        }
        curStrPos += numChars;
        const nextString = curString.substring(0, curStrPos);
        this.replaceText(nextString);
        this.typewrite(curString, curStrPos);
    }
    doneTyping(curString, curStrPos) {
        this.options.onStringTyped(this.arrayPos, this);
        this.toggleBlinking(true);
        if (this.arrayPos === this.strings.length - 1) {
            this.complete();
            if (this.loop === false || this.curLoop === this.loopCount) {
                return;
            }
        }
        this.timeout = setTimeout(() => {
            this.backspace(curString, curStrPos);
        }, this.backDelay);
    }
    backspace(curString, curStrPos) {
        if (this.pause.status === true) {
            this.setPauseStatus(curString, curStrPos, false);
            return;
        }
        if (this.fadeOut)
            return this.initFadeOut();
        this.toggleBlinking(false);
        const humanize = this.humanizer(this.backSpeed);
        this.timeout = setTimeout(() => {
            curStrPos = htmlParser.backSpaceHtmlChars(curString, curStrPos, this);
            const curStringAtPosition = curString.substring(0, curStrPos);
            this.replaceText(curStringAtPosition);
            if (this.smartBackspace) {
                let nextString = this.strings[this.arrayPos + 1];
                if (nextString &&
                    curStringAtPosition === nextString.substring(0, curStrPos)) {
                    this.stopNum = curStrPos;
                }
                else {
                    this.stopNum = 0;
                }
            }
            if (curStrPos > this.stopNum) {
                curStrPos--;
                this.backspace(curString, curStrPos);
            }
            else if (curStrPos <= this.stopNum) {
                this.arrayPos++;
                if (this.arrayPos === this.strings.length) {
                    this.arrayPos = 0;
                    this.options.onLastStringBackspaced();
                    this.shuffleStringsIfNeeded();
                    this.begin();
                }
                else {
                    this.typewrite(this.strings[this.sequence[this.arrayPos]], curStrPos);
                }
            }
        }, humanize);
    }
    complete() {
        this.options.onComplete(this);
        if (this.loop) {
            this.curLoop++;
        }
        else {
            this.typingComplete = true;
        }
    }
    setPauseStatus(curString, curStrPos, isTyping) {
        this.pause.typewrite = isTyping;
        this.pause.curString = curString;
        this.pause.curStrPos = curStrPos;
    }
    toggleBlinking(isBlinking) {
        if (!this.cursor)
            return;
        if (this.pause.status)
            return;
        if (this.cursorBlinking === isBlinking)
            return;
        this.cursorBlinking = isBlinking;
        if (isBlinking) {
            this.cursor.classList.add('typed-cursor--blink');
        }
        else {
            this.cursor.classList.remove('typed-cursor--blink');
        }
    }
    humanizer(speed) {
        return Math.round((Math.random() * speed) / 2) + speed;
    }
    shuffleStringsIfNeeded() {
        if (!this.shuffle)
            return;
        this.sequence = this.sequence.sort(() => Math.random() - 0.5);
    }
    initFadeOut() {
        this.el.className += ` ${this.fadeOutClass}`;
        if (this.cursor)
            this.cursor.className += ` ${this.fadeOutClass}`;
        return setTimeout(() => {
            this.arrayPos++;
            this.replaceText('');
            if (this.strings.length > this.arrayPos) {
                this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);
            }
            else {
                this.typewrite(this.strings[0], 0);
                this.arrayPos = 0;
            }
        }, this.fadeOutDelay);
    }
    replaceText(str) {
        if (this.attr) {
            this.el.setAttribute(this.attr, str);
        }
        else {
            if (this.isInput) {
                this.el.value = str;
            }
            else if (this.contentType === 'html') {
                this.el.innerHTML = str;
            }
            else {
                this.el.textContent = str;
            }
        }
    }
    bindFocusEvents() {
        if (!this.isInput)
            return;
        this.el.addEventListener('focus', (e) => {
            this.stop();
        });
        this.el.addEventListener('blur', (e) => {
            if (this.el.value && this.el.value.length !== 0) {
                return;
            }
            this.start();
        });
    }
    insertCursor() {
        if (!this.showCursor)
            return;
        if (this.cursor)
            return;
        this.cursor = document.createElement('span');
        this.cursor.className = 'typed-cursor';
        this.cursor.setAttribute('aria-hidden', true);
        this.cursor.innerHTML = this.cursorChar;
        this.el.parentNode &&
            this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
    }
}
