@nearBindgen
export class Word {
  lang: string = "en-us";
  constructor(public text: string, lang: string = "en-us") {
    this.lang = lang;
  }
}
