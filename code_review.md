###CODE_REVIEW
```File: src/lib.js
1: parse input should be in main

File: src/parser.js
5: extract function
62,69: no need of passing arguments and swap args
1: parseInput can be modified

File: src/errorHandler.js
11: head can be hardcoded
36: confusing variable names
49: parser should be telling about presence of the error
18: duplicate functions
44: extract calling statement into variable 
47: file should change to fileName

File: test/libTest.js
1: no need of de- structuring
24: existsSync can be modifed
33: can be declaired as global
89,138: line can be removed
97: Modify description of test case
207: no need of test case
218: misplaced closing of describe block
324: args can be swapped

File: test/errorHandler.js
29: Modify description of test case```