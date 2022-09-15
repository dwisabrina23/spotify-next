import fetcher from './fetcher'

type Mode = 'signin' | 'signup'
interface Body {
  email: string
  password: string
}

export const auth = (mode: Mode, body: Body) => {
  return fetcher(`/${mode}`, body)
}
