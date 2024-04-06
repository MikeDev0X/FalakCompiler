final_words = []
comment_is_active = False

labels = {
    "break": "KW_BREAK",
    "dec": "KW_DEC",
    "do": "KW_DO",
    "else": "KW_ELSE",
    "elseif": "KW_ELSEIF",
    "false": "KW_FALSE",
    "if": "KW_IF",
    "inc": "KW_INC",
    "return": "KW_RETURN",
    "true": "KW_TRUE",
    "var": "KW_VAR",
    "while": "KW_WHILE"
}

restrictions = [
    ",",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    '"',
    ";",
    "\n"
]

def split_word(multi_word):
    global final_words, comment_is_active

    line_index = 0

    left = 0
    right = 1

    while True:
        if left <= len(multi_word) and right <= len(multi_word):
            if "<#" in multi_word and "#>" not in multi_word: # starts but doesn't end on the same line
                comment_is_active = True
                break
            if "#>" in multi_word and "<#" not in multi_word: # ends and didn't start on the same line
                comment_is_active = False
                break
            if "#>" in multi_word and "<#" in multi_word: # comment is opened and closed on the same line
                left = multi_word.find("#>") + 2
                right = multi_word.find("#>") + 2
                comment_is_active = False

            if left == right:
                right += 1
                continue

            if not comment_is_active:
                print(multi_word[left:right])
                print(multi_word[left])
                print(multi_word[right])

                if multi_word[right] == " ":
                    if multi_word[left] in restrictions: # EX: ", "
                        # stores the restriction before updating pointers
                        final_words.append(multi_word[left:right])
                    left = right + 1
                    right += 1
                    continue

                if multi_word[left] == " ":
                    left += 1
                    right = left + 1

                if multi_word[left] not in restrictions and multi_word[right] not in restrictions:
                    # not restrictions found with those indexes
                    print("left: ", left, "right: ", right)
                    if multi_word[left:right+1] in labels:
                        # word found, stores in splitWords array
                        final_words.append(multi_word[left:right+1])
                        left = right + 1
                        right += 1
                    else:
                        # move right pointer
                        right += 1
                else:
                    print("left: ", left, "right: ", right)
                    # found a border in one of the pointers
                    if multi_word[left] in restrictions and multi_word[right] not in restrictions:
                        # found border on the left pointer
                        # pushes word and border
                        final_words.append(multi_word[left])
                        left += 1
                    elif multi_word[left] not in restrictions and multi_word[right] in restrictions:
                        # found border on the right pointer
                        # pushes word and border
                        final_words.append(multi_word[left:right])
                        left = right
                        right += 1
                    elif multi_word[left] in restrictions and multi_word[right] in restrictions:
                        final_words.append(multi_word[left:right])
                        final_words.append(multi_word[left+1:right+1])
                        left = right + 1
                        right += 1
                        print("aqui")
            else:
                # classify line as comment
                line_index += 1
                break
            line_index += 1
        else:
            break

def read_file(file_name):
    import os
    full_content = open(file_name, 'r').read()

    for line in full_content.splitlines():
        curr_line = line
        split_word(curr_line)

    print(final_words)

read_file("hello.falak")