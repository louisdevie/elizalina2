lexer grammar TMLexer;

fragment IDENTIFIER
    : [A-Za-z_] [A-Za-z0-9_]*
    ;

LINE_COMMENT_START
    : '#'
    -> pushMode(LINE_COMMENT_MODE)
    ;

DIRECTIVE_NAME
    : '@' IDENTIFIER
    -> pushMode(DIRECTIVE_MODE)
    ;

HEADER_START
    : '@{'
    -> pushMode(EMBEDDED_CODE_MODE)
    ;

NEW_LINE
    : '\r'? '\n'
    ;

SEPARATOR
    : '='
    ;

KEY
    : IDENTIFIER
    ;

SINGLE_QUOTE
    : '\''
    -> pushMode(SINGLE_QUOTED_TEXT_MODE)
    ;

DOUBLE_QUOTE
    : '"'
    -> pushMode(DOUBLE_QUOTED_TEXT_MODE)
    ;

OPENING_PARENS
    : '('
    ;

CLOSING_PARENS
    : ')'
    ;

SPACE
    : [ \t]+
    -> skip
    ;


mode LINE_COMMENT_MODE;

LINE_COMMENT_TEXT
    : ~( '\r' | '\n' )+
    -> popMode
    ;


mode DIRECTIVE_MODE;

DIRECTIVE_ARGUMENT
    : ~[ \t\r\n]+
    ;

DIRECTIVE_ARGUMENT_SEPARATOR
    : [ \t]+
    -> skip
    ;

END_OF_DIRECTIVE
    : '\r'? '\n'
    -> popMode
    ;

mode EMBEDDED_CODE_MODE;

EMBEDDED_CODE_OPENING_BRACE
    : '{'
    -> pushMode(EMBEDDED_CODE_MODE)
    ;

EMBEDDED_CODE_CLOSING_BRACE
    : '}'
    -> popMode
    ;

EMBEDDED_CODE
    : ~( '{' | '}' )+
    ;


mode SINGLE_QUOTED_TEXT_MODE;

SINGLE_QUOTED_ESCAPE
    : '\\' ( '\\' | 'n' | 't' | 'r' | '\'' )
    | '{{'
    | '}}'
    ;

SINGLE_QUOTED_BAD_ESCAPE
    : '\\' .
    ;

SINGLE_QUOTED_PARAMETER_START
    : '{'
    -> pushMode(PARAMETER_MODE)
    ;

SINGLE_QUOTE_CLOSING
    : '\''
    -> popMode
    ;

SINGLE_QUOTE_NEWLINE
    : '\n'
    -> popMode
    ;

SINGLE_QUOTED_TEXT_LITERAL
    : ~( '\\' | '\'' | '{' | '}' | '\n' )+
    ;


mode DOUBLE_QUOTED_TEXT_MODE;

DOUBLE_QUOTED_ESCAPE
    : '\\' ( '\\' | 'n' | 't' | 'r' | '"' )
    | '{{'
    | '}}'
    ;

DOUBLE_QUOTED_BAD_ESCAPE
    : '\\' .
    ;

DOUBLE_QUOTED_PARAMETER_START
    : '{'
    -> pushMode(PARAMETER_MODE)
    ;

DOUBLE_QUOTE_CLOSING
    : '"'
    -> popMode
    ;

DOUBLE_QUOTE_NEWLINE
    : '\n'
    -> popMode
    ;

DOUBLE_QUOTED_TEXT_LITERAL
    : ~( '\\' | '"' | '{' | '}' | '\n' )+
    ;


mode PARAMETER_MODE;

PARAMETER_NAME
    : IDENTIFIER
    ;

MESSAGE_INTERPOLATION_PREFIX
    : '%'
    ;

FORMAT_SEPARATOR
    : ':'
    -> popMode, pushMode(EMBEDDED_CODE_MODE)
    ;

CUSTOM_FORMAT_SEPARATOR
    : '|'
    -> popMode, pushMode(EMBEDDED_CODE_MODE)
    ;

PARAMETER_END
    : '}'
    -> popMode
    ;