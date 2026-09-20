export const PROJECT_INFO = {
  name: "O Governante",
  version: "0.9.0",

  creator: {
    name: "Miguel de Carvalho",
    credit:
      "Idealizado e criado por Miguel de Carvalho"
  },

  description: `
O Governante surgiu como um projeto de simulação política. Afinal, a própria situação política brasileira muitas vezes já parece uma sátira. O jogo busca oferecer entretenimento e, ao mesmo tempo, provocar uma reflexão sobre a política brasileira.

A ideia nasceu da percepção de que, embora a política seja amplamente debatida no Brasil, ainda é pouco compreendida. Por isso, o jogo também procura apresentar fatos e explicar, de maneira bem-humorada, como certas coisas funcionam e o que pode acontecer por baixo do tapete.

O recado é simples: não acreditem em tudo o que veem. Como já diria o ET Bilu: “Busquem conhecimento”.

Um agradecimento especial à Dra. Isadora, minha mulher e advogada (afinal, provavelmente vou precisar dela para me defender dos processos), e um abraço aos meus amigos de código: Gustavo, o PHP, e Vitor Alves, o Demandas Vitão.
`.trim(),

  disclaimer:
    "Esta obra é uma sátira fictícia. Personagens, partidos, situações e nomes paródicos são usados com finalidade humorística e não representam afirmações factuais sobre pessoas reais. Eventos documentais exibem suas respectivas fontes.",

  support: {
    /*
     * Prefira uma chave Pix aleatória.
     * Deixe vazio enquanto não quiser
     * exibir a chave publicamente.
     */
    pixKey: "00020126580014BR.GOV.BCB.PIX013694f869a3-f3bb-4fe0-a093-68e47a92d5835204000053039865802BR5925Miguel Ferreira de Carval6009SAO PAULO62140510EBOsWcb0m9630432C4",

    /*
     * Exporte o QR Code pelo aplicativo
     * do banco e salve em:
     * public/pix-qrcode.png
     */
    qrCodePath: "/pix-qrcode.png",

    message:
      "Se o jogo arrancou uma risada ou uma crise institucional controlada, você pode apoiar o desenvolvimento com qualquer valor."
  },

  socialLinks: [
    {
      id: "github",
      icon: "💻",
      label: "GitHub",
      url: "https://github.com/omigueldecarvalho"
    },
    {
      id: "linkedin",
      icon: "💼",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/miguel-de-carvalho-2bb1231ba"
    },
    {
      id: "instagram",
      icon: "📸",
      label: "Instagram",
      url: "https://www.instagram.com/omiguellll/"
    },
  ]
};
