parser grammar TMParser;

options {
    tokenVocab = TMLexer;
}


translation
    : NEW_LINE*
      ( header line_comment? | message line_comment? | line_comment )?
      ( NEW_LINE+
        ( message line_comment? | line_comment)
      )*
      NEW_LINE* EOF
    ;

line_comment
    : LINE_COMMENT_START LINE_COMMENT_TEXT
    ;

header
    : HEADER_START
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;

message
    : KEY SEPARATOR ( single_quoted_text | double_quoted_text )
    ;

single_quoted_text
    : SINGLE_QUOTE
      ( SINGLE_QUOTED_TEXT_LITERAL
      | SINGLE_QUOTED_ESCAPE
      | single_quoted_text_parameter
      )*
      SINGLE_QUOTE_CLOSING
    ;

double_quoted_text
    : DOUBLE_QUOTE
      ( DOUBLE_QUOTED_TEXT_LITERAL
      | DOUBLE_QUOTED_ESCAPE
      | double_quoted_text_parameter
      )*
      DOUBLE_QUOTE_CLOSING
    ;

single_quoted_text_parameter
    : SINGLE_QUOTED_PARAMETER_START
      PARAMETER_NAME
      ( shorthand_parameter_format | parameter_format | PARAMETER_END )
    ;

double_quoted_text_parameter
    : DOUBLE_QUOTED_PARAMETER_START
      PARAMETER_NAME
      ( shorthand_parameter_format | parameter_format | PARAMETER_END )
    ;

parameter_format
    : FORMAT_SEPARATOR
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;

shorthand_parameter_format
    : SHORTHAND_FORMAT_SEPARATOR
      ( EMBEDDED_CODE | EMBEDDED_CODE_OPENING_BRACE | EMBEDDED_CODE_CLOSING_BRACE )*
      EMBEDDED_CODE_CLOSING_BRACE
    ;