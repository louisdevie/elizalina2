import { ErrorListener, RecognitionException, Recognizer, Token } from 'antlr4'

export default class AntlrErrorListener implements ErrorListener<Token> {
  syntaxError(
    recognizer: Recognizer<Token>,
    offendingSymbol: Token,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | undefined,
  ): void {
    throw new Error('Method not implemented.')
  }
}
