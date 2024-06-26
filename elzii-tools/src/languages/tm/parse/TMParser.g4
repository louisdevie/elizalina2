parser grammar TMParser;

options {
    tokenVocab = TMLexer;
}

@parser::header {
  import { badRule } from '../parserExtensions';
}


translation
    : NEW_LINE*
      ( directive NEW_LINE* )*
      ( header lineComment? | message lineComment? | lineComment )?
      ( ( NEW_LINE | END_OF_DIRECTIVE | SINGLE_QUOTE_NEWLINE | DOUBLE_QUOTE_NEWLINE )+
        ( message lineComment? | lineComment | notAMessage )
      )*
      NEW_LINE* EOF
    ;

lineComment
    : LINE_COMMENT_START LINE_COMMENT_TEXT
    ;

header
    : HEADER_START
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;

directive
    : DIRECTIVE_NAME
      ( DIRECTIVE_ARGUMENT | DIRECTIVE_ARGUMENT_SEPARATOR )*
      END_OF_DIRECTIVE
    ;

message
    : ( KEY | OPENING_PARENS KEY CLOSING_PARENS ) SEPARATOR ( singleQuotedText | doubleQuotedText )
    ;

// this rule is used to recover from an out-of-order translation file.
// it matches invalid sections so that every message can still be parsed correctly.
notAMessage
    : ( HEADER_START | DIRECTIVE_NAME ) { badRule(this) }
      ~( NEW_LINE | END_OF_DIRECTIVE )*
    ;

singleQuotedText
    : SINGLE_QUOTE
      ( SINGLE_QUOTED_TEXT_LITERAL
      | SINGLE_QUOTED_ESCAPE
      | singleQuotedTextParameter
      | singleQuotedTextMI
      )*
      SINGLE_QUOTE_CLOSING
    ;

doubleQuotedText
    : DOUBLE_QUOTE
      ( DOUBLE_QUOTED_TEXT_LITERAL
      | DOUBLE_QUOTED_ESCAPE
      | doubleQuotedTextParameter
      | doubleQuotedTextMI
      )*
      DOUBLE_QUOTE_CLOSING
    ;

singleQuotedTextParameter
    : SINGLE_QUOTED_PARAMETER_START
      PARAMETER_NAME
      ( customParameterFormat | parameterFormat | PARAMETER_END )
    ;

doubleQuotedTextParameter
    : DOUBLE_QUOTED_PARAMETER_START
      PARAMETER_NAME
      ( customParameterFormat | parameterFormat | PARAMETER_END )
    ;

parameterFormat
    : FORMAT_SEPARATOR
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;

customParameterFormat
    : CUSTOM_FORMAT_SEPARATOR
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;

singleQuotedTextMI
    : SINGLE_QUOTED_PARAMETER_START
      MESSAGE_INTERPOLATION_PREFIX
      PARAMETER_NAME
      PARAMETER_END
    ;

doubleQuotedTextMI
    : DOUBLE_QUOTED_PARAMETER_START
      MESSAGE_INTERPOLATION_PREFIX
      PARAMETER_NAME
      PARAMETER_END
    ;