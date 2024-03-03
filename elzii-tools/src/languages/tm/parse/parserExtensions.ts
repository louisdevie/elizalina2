import { InputMismatchException, Parser, Token } from 'antlr4'
import antlr4 from 'antlr4'

// for some reason, this exception is not actually exported by the index, so we have to go get it ourselves
const _InputMismatchException: typeof InputMismatchException = (antlr4 as any)['error'][
  'InputMismatchException'
]

class BadRuleMatchedException extends _InputMismatchException {
  public constructor(recognizer: Parser, actualToken?: Token) {
    super(recognizer)
    if (actualToken) this.offendingToken = actualToken
  }
}

function displayToken(token: Token): string {
  // taken straight from ANTLR source code
  let result
  if (token.text) {
    result = `'${token.text}'`
  } else {
    if (token.type === Token.EOF) {
      result = '<EOF>'
    } else {
      result = '<' + token.type + '>'
    }
  }
  return result
}

export function badRule($this: Parser) {
  const firstToken = $this._input.LT(-1)
  const message = `input ${displayToken(firstToken)} was not expected at this point`

  $this.notifyErrorListeners(message, firstToken, new BadRuleMatchedException($this, firstToken))
}
