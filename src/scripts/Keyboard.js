/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Keyboard = {
  elements: {
    main: null,
    keyContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    caretStart: 0,
    caretEnd: 0,
    capsLock: false,
    shift: false,
    lang: 'en',
    sound: true,
    mic: false,
    rec: new SpeechRecognition(),
    pressed: false,
    opened: false
  },

  init() {
    this.textArea = document.querySelector('#search');
    this.elements.main = document.createElement('div');
    this.elements.keyContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keyContainer.classList.add('keyboard__keys');
    this.elements.keyContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keyContainer);
    document.querySelector('.search-wrapper').appendChild(this.elements.main);

    this.properties.rec.lang = this.properties.lang === 'en' ? 'en-Us' : 'ru-RU';
    this.properties.rec.interimResults = false;

    document.querySelector('#keyboard').addEventListener('click', () => {
      if (this.opened === true) {
        this.close();
      } else {
        this.open(this.textArea.value, currentValue => {
          this.textArea.value = currentValue;
          this.textArea.selectionStart = this.properties.caretStart;
          this.textArea.selectionEnd = this.properties.caretEnd;
          this.textArea.focus();
        });
      }
      this.opened = !this.opened;
    });

    document.addEventListener('keydown', event => {
      if (this.elements.main.classList.contains('keyboard--hidden')) return;
      event.stopPropagation();
      if (event.key === 'Shift') {
        if (this.properties.pressed) return;
        document.getElementById('shift').classList.add('active-press');
        document.getElementById('shift').click();
        this.properties.pressed = true;
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        document.getElementById('backspace').classList.add('active-press');
        document.getElementById('backspace').click();
      }
    }, false);

    document.addEventListener('keyup', (event) => {
      event.stopPropagation();

      let code;

      if (event.code === 'ShiftLeft') {
        code = 'shift';
      } else {
        code = event.code.toLowerCase();
      }

      switch (code) {
        case 'space':
        case 'enter':
        case 'arrowleft':
        case 'arrowright':
        case 'shift':
        case 'capslock':
          document.getElementById(code).classList.add('active-press');
          document.getElementById(code).click();
          this.triggerEvent('oninput');
          break;
        default:
          break;
      }
      Keyboard.elements.keys.forEach(element => {
        if (element.textContent === event.key && event.key !== 'Backspace') {
          element.classList.add('active-press');
          element.click();
          this.triggerEvent('oninput');
        }
      });

      Keyboard.elements.keys.forEach(element => {
        setTimeout(() => {
          element.classList.remove('active-press');
        }, 500);
      });
      this.properties.pressed = false;
    });

    this.textArea.addEventListener('click', () => {
      this.properties.caretStart = this.textArea.selectionStart;
      this.properties.caretEnd = this.textArea.selectionEnd;
      this.triggerEvent('oninput');
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'caps', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'shift', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter',
      'done', 'en', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'mic',
      'arrow back', 'space', 'arrow forward'
    ];
    const keyLayoutRu = [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'caps', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
      'shift', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'done', 'ru', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'mic',
      'arrow back', 'space', 'arrow forward'
    ];
    const keyLayoutShift = [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
      'caps', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|',
      'shift', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', 'enter',
      'done', 'en', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', 'mic',
      'arrow back', 'space', 'arrow forward'
    ];
    const keyLayoutRuShift = [
      'ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
      'caps', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '/',
      'shift', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'done', 'ru', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', 'mic',
      'arrow back', 'space', 'arrow forward'
    ];

    let mainLayout;
    let breakLayout;

    if (this.properties.lang === 'en') {
      if (this.properties.shift) {
        mainLayout = keyLayoutShift;
        breakLayout = ['backspace', 'mic', 'enter', '\\'];
      } else {
        mainLayout = keyLayout;
        breakLayout = ['backspace', 'mic', 'enter', 'mic', '\\'];
      }
    } else if (this.properties.shift) {
      mainLayout = keyLayoutRuShift;
      breakLayout = ['backspace', 'mic', 'enter', '\\'];
    } else {
      mainLayout = keyLayoutRu;
      breakLayout = ['backspace', 'mic', 'enter', '\\'];
    }

    const createIconHTML = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`;
    };

    mainLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak = breakLayout.indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace': {
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');
          keyElement.setAttribute('id', 'backspace');

          keyElement.addEventListener('click', () => {
            if (this.properties.caretStart === this.properties.value.length) {
              this.properties.value = this.properties.value
                .substr(0, this.properties.value.length - 1);
              this.properties.caretStart -= 1;
              this.properties.caretEnd = this.properties.caretStart;
            } else if (this.textArea.selectionStart === this.textArea.selectionEnd) {
              this.properties.value = this.properties.value
                .substr(0, this.properties.caretStart - 1)
                + this.properties.value
                  .substr(this.properties.caretStart, this.properties.value.length);
              this.properties.caretStart -= 1;
              this.properties.caretEnd = this.properties.caretStart;
            } else if (this.textArea.selectionStart < this.textArea.selectionEnd) {
              this.properties.value = this.properties.value
                .substr(0, this.textArea.selectionStart)
                + this.properties.value
                  .substr(this.textArea.selectionEnd, this.properties.value.length);
              this.properties.caretStart = this.textArea.selectionStart;
              this.properties.caretEnd = this.properties.caretStart;
            } else if (this.textArea.selectionStart > this.textArea.selectionEnd) {
              this.properties.value = this.properties.value
                .substr(0, this.textArea.selectionEnd)
                + this.properties.value
                  .substr(this.textArea.selectionStart, this.properties.value.length);
              this.properties.caretStart = this.properties.caretEnd;
            }
            this.triggerEvent('oninput');
          });
          break;
        }
        case 'caps': {
          if (this.properties.capsLock) {
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--active');
          } else {
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          }
          keyElement.setAttribute('id', 'capslock');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
            this.triggerEvent('oninput');
          });

          break;
        }
        case 'shift': {
          if (this.properties.shift) {
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--active');
          } else {
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          }
          keyElement.innerHTML = createIconHTML('input');
          keyElement.setAttribute('id', 'shift');

          keyElement.addEventListener('click', () => {
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
            this.toggleShift();
            this.triggerEvent('oninput');
          });

          break;
        }
        case 'enter': {
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');
          keyElement.setAttribute('id', 'enter');
          keyElement.addEventListener('click', () => {
            if (this.properties.caretStart === this.properties.value.length) {
              this.properties.value += '\n';
            } else {
              this.properties.value = this.properties.value.substr(0, this.properties.caretStart) + '\n'
                + this.properties.value
                  .substr(this.properties.caretStart, this.properties.value.length);
            }
            this.properties.caretStart += 1;
            this.properties.caretEnd = this.properties.caretStart;
            this.triggerEvent('oninput');
          });

          break;
        }
        case 'space': {
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.setAttribute('id', 'space');
          keyElement.addEventListener('click', () => {
            if (this.properties.caretStart === this.properties.value.length) {
              this.properties.value += ' ';
            } else {
              this.properties.value = this.properties.value.substr(0, this.properties.caretStart) + ' '
                + this.properties.value
                  .substr(this.properties.caretStart, this.properties.value.length);
            }
            this.properties.caretStart += 1;
            this.properties.caretEnd = this.properties.caretStart;
            this.triggerEvent('oninput');
          });

          break;
        }
        case 'done': {
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
            this.opened = false;
          });

          break;
        }
        case 'arrow back': {
          keyElement.innerHTML = createIconHTML('arrow_back');
          keyElement.setAttribute('id', 'arrowleft');

          keyElement.addEventListener('click', () => {
            if (this.properties.shift) {
              this.properties.caretStart = this.properties.caretStart === 0
                ? 0 : this.properties.caretStart - 1;
            } else {
              this.properties.caretStart = this.properties.caretStart === 0
                ? 0 : this.properties.caretStart - 1;
              this.properties.caretEnd = this.properties.caretStart;
            }
            this.triggerEvent('oninput');
          });

          break;
        }
        case 'arrow forward': {
          keyElement.innerHTML = createIconHTML('arrow_forward');
          keyElement.setAttribute('id', 'arrowright');
          keyElement.addEventListener('click', () => {
            if (this.properties.shift) {
              this.properties.caretEnd = this.properties.caretEnd === this.properties.value.length
                ? this.properties.value.length : this.properties.caretEnd + 1;
            } else {
              this.properties.caretStart = this.properties.caretStart
              === this.properties.value.length
                ? this.properties.value.length : this.properties.caretStart + 1;
              this.properties.caretEnd = this.properties.caretStart;
            }
            this.triggerEvent('oninput');
          });

          break;
        }

        case 'en':
        case 'ru': {
          keyElement.textContent = key.toLowerCase();
          keyElement.setAttribute('id', 'lang');
          keyElement.addEventListener('click', () => {
            this.toggleLang();
            this.triggerEvent('oninput');
          });

          break;
        }

        case 'mic': {
          keyElement.innerHTML = createIconHTML('mic_none');
          keyElement.setAttribute('id', 'mic');
          keyElement.classList.add('keyboard__key--activatable', 'keyboard__key--wide');

          keyElement.addEventListener('click', () => {
            keyElement.classList.toggle('keyboard__key--active-red');

            this.toggleMic();
            this.triggerEvent('oninput');

            this.properties.rec.addEventListener('result', e => {
              const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

              const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');

              if (e.results[0].isFinal) {
                this.properties.value = this.properties.value.substr(0, this.properties.caretStart)
                + poopScript + ' '
                + this.properties.value
                  .substr(this.properties.caretStart, this.properties.value.length);
                this.properties.caretStart = this.properties.caretStart + poopScript.length + 1;
                this.properties.caretEnd = this.properties.caretStart;
                this.triggerEvent('oninput');
              }
            }, false);

            if (this.properties.mic) {
              this.properties.rec.start();
              this.properties.rec.addEventListener('end', this.properties.rec.start, false);
            } else {
              this.properties.rec.removeEventListener('end', this.properties.rec.start, false);
              this.properties.rec.stop();
              this.properties.rec = new SpeechRecognition();
              this.properties.rec.lang = this.properties.lang === 'en' ? 'en-Us' : 'ru-RU';
              this.properties.rec.interimResults = false;
            }
          }, false);
          break;
        }

        default: {
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', () => {
            let char;
            if ((this.properties.capsLock && !this.properties.shift)
              || ((!this.properties.capsLock && this.properties.shift) && (key !== 'ru' && key !== 'en'))) {
              char = key.toUpperCase();
            } else {
              char = key.toLowerCase();
            }

            if (this.properties.caretStart === this.properties.value.length) {
              this.properties.value += char;
              this.properties.caretStart = this.properties.value.length;
              this.properties.caretEnd = this.properties.caretStart;
            } else {
              this.properties.value = this.properties.value
                .substr(0, this.properties.caretStart) + char
                + this.properties.value
                  .substr(this.properties.caretEnd, this.properties.value.length);
              this.properties.caretStart += 1;
              this.properties.caretEnd = this.properties.caretStart;
            }

            this.triggerEvent('oninput');
          }, false);
          break;
        }
      }
      fragment.appendChild(keyElement);
      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
      this.textArea.dispatchEvent(new Event('input'));
    }
  },

  toggleMic() {
    this.properties.mic = !this.properties.mic;
    if (this.properties.mic) {
      document.querySelector('#mic > i').innerHTML = 'mic';
    } else {
      document.querySelector('#mic > i').innerHTML = 'mic_none';
    }
  },

  toggleSound() {
    this.properties.sound = !this.properties.sound;

    const sound = document.querySelector('#sound > i');

    if (this.properties.sound) {
      sound.textContent = 'volume_up';
    } else {
      sound.textContent = 'volume_off';
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && (key.textContent !== 'ru' && key.textContent !== 'en')) {
        if ((this.properties.capsLock && !this.properties.shift)
                    || (!this.properties.capsLock && this.properties.shift)) {
          key.textContent = key.textContent.toUpperCase();
        } else {
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
  },

  swapLayout() {
    this.elements.keyContainer.innerHTML = '';
    this.elements.keyContainer.appendChild(this.createKeys());
    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');
  },

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.swapLayout();

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && (key.textContent !== 'ru' && key.textContent !== 'en')) {
        if ((this.properties.capsLock && !this.properties.shift)
                    || (!this.properties.capsLock && this.properties.shift)) {
          key.textContent = key.textContent.toUpperCase();
        } else {
          key.textContent = key.textContent.toLowerCase();
        }
      }
    }
  },

  toggleLang() {
    if (this.properties.mic) {
      return;
    }

    this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';
    this.properties.rec.lang = this.properties.lang === 'en' ? 'en-Us' : 'ru-RU';

    if (this.properties.capsLock) {
      this.toggleCapsLock();
    }

    this.swapLayout();
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
};

export default Keyboard;
