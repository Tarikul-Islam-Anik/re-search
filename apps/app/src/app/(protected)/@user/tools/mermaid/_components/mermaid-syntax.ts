export const mermaidSyntax = {
  defaultToken: '',
  tokenPostfix: '.mermaid',

  keywords: [
    'graph',
    'flowchart',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram',
    'erDiagram',
    'gantt',
    'pie',
    'journey',
    'gitGraph',
    'requirementDiagram',
    'TD',
    'TB',
    'BT',
    'RL',
    'LR',
    'participant',
    'actor',
    'class',
    'state',
    'title',
    'section',
    'subgraph',
    'end',
    'direction',
    'style',
  ],

  typeKeywords: ['string', 'number', 'boolean', 'undefined', 'null'],

  operators: [
    '=',
    '>',
    '<',
    '!',
    '~',
    '?',
    ':',
    '==',
    '<=',
    '>=',
    '!=',
    '&&',
    '||',
    '++',
    '--',
    '+',
    '-',
    '*',
    '/',
    '&',
    '|',
    '^',
    '%',
    '<<',
    '>>',
    '>>>',
    '+=',
    '-=',
    '*=',
    '/=',
    '&=',
    '|=',
    '^=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
  ],

  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@default': 'identifier',
          },
        },
      ],

      // Whitespace
      { include: '@whitespace' },

      // Delimiters and operators
      [/[{}()[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'operator',
            '@default': '',
          },
        },
      ],

      // Numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/'/, { token: 'string.quote', bracket: '@open', next: '@string' }],

      // Arrows and connections
      [
        /-->|==>|-.->|===>|--x|--o|<-->|<-.->|x--|o--|<===>|===|---|--/,
        'arrow',
      ],
      [/\|>|o-o|<\|/, 'arrow'],
    ],

    string: [
      [/[^\\"']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/["']/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/%%.*$/, 'comment'],
      [/%\*/, 'comment', '@comment'],
    ],

    comment: [
      [/[^*%]+/, 'comment'],
      [/%\*/, 'comment', '@push'],
      [/\*%/, 'comment', '@pop'],
      [/[*%]/, 'comment'],
    ],
  },
};
