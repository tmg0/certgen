interface Zerossl {
  username: string
  password: string
  domain: string
}

interface CertgenConfig  {
  zerossl?: Zerossl
}
