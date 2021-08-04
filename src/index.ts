class CustomStorage {
  driver: Storage = window.localStorage;
  expire: number = 0;
  prefix: string = '';

  constructor(prefix: string | null, expire: number) {
    this.prefix = prefix || '';

    if (typeof window === 'undefined') {
      console.warn('no find window');
      return;
    }

    if (expire === -1) {
      this.driver = window.sessionStorage;
    } else {
      this.driver = window.localStorage;
      this.expire = expire || 0;
    }
  }

  _key(key: string): string {
    return this.prefix + key;
  }

  keys():  string[] | string {
    const keys = Object.keys(this.driver);

    if (this.prefix) {
      const index = this.prefix.length;

      return keys.map(function(key) {
        return key.substring(index);
      });
    }

    return keys;
  }

  remove(key: string): void {
    this.driver.removeItem(this._key(key));
  }

  clear(): void {
    this.driver.clear();
  }

  set(key: string, value: any, expire?: number): void {
    const data = {
      value,
      expire: Date.now() + (Number(expire)  * 1000)
    };

    if (typeof expire === 'undefined') {
      expire = this.expire;
    }

    this.driver.setItem(this._key(key), JSON.stringify({...data}));
  }

  get(key: string): any {
    const data = this.driver.getItem(this._key(key));

    if (data) {
      let l = JSON.parse(data);

      if (l.expire) {
        if (l.expire < Date.now()) {
          this.remove(key);
          l = null;
        }
      }
      return l && l.value
    }

    return null
  }
}

export default new CustomStorage(null, 10 * 365 * 24 * 60 * 60)
