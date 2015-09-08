//a simple trie implementation

var exampleTrie = new Trie();
var words = ["fe", "fe", "fie", "fo", "fum", "foo", "food", "lonely", "long"];
exampleTrie.addWords(words);

var exampleAutocorrect = new Autocorrect(words, 1);

function levenshtein(word1, word2) {
	var prevRow = [];
	var row = [];

	//fill the array with a range -- the distance to an empty string
	for (var i = 0; i <= word2.length; i++) {
		prevRow.push(i);
		row.push(0);
	}

	//call the helper for each character in word1
	for (var i = 0; i < word1.length; i++) {
		levenshteinRow(word1[i], word2, row, prevRow);
	}

	return row[row.length - 1];

}

function levenshteinRow(word1Char, word2, row, prevRow) {
	row[0] = prevRow[0] + 1;
	for (var i = 1; i < row.length; i++) {
		if (word2[i - 1] == word1Char) {
			row[i] = prevRow[i - 1];
		} else {
			row[i] = Math.min(Math.min(row[i - 1], prevRow[i]), prevRow[i - 1]) + 1;
		}
	}

	for (var i = 0; i < row.length; i++) {
		prevRow[i] = row[i];
	}
}

function Autocorrect(words, levenshteinDist) {
	var trie = new Trie();

	trie.addWords(words);

	this.levenshteinDist = levenshteinDist;

	this.addWords = function(words) {
		trie.addWords(words);
	};

	this.getSuggestions = function(word) {
		var suggestions = removeDuplicates(trie.suffixes(word).concat(trie.similarWords(word, this.levenshteinDist)));
		suggestions.sort(function(suggestion1, suggestion2) {
			if (suggestion1 === word) {
				return -1;
			}
			if (suggestion2 === word) {
				return 1;
			}
			var result = levenshtein(suggestion1, word) - levenshtein(suggestion2, word);
			if (result === 0) {
				result = trie.countOcurrences(suggestion1) - trie.countOcurrences(suggestion2);
			}
			if (result === 0) {
				result = suggestion1.toLowerCase().localeCompare(suggestion2.toLowerCase());
			}
			return result;
		});
		return suggestions;
	};


}


function Trie() {
	this.count = 0;

	this.children = {};

	this.addWords = function(words) {
		for (var i = 0; i < words.length; i++) {
			this.addWord(words[i]);
		}
	};

	this.addWordHelper = function(word, pos) {
		if (pos === word.length && pos !== 0) { //empty strings don't get counted
			this.count++;
		}
		if (pos < word.length) {
			var curChar = word[pos];

			if (this.children[curChar] === undefined) {
				this.children[curChar] = new Trie();
			}

			this.children[curChar].addWordHelper(word, pos + 1);
		}
	}

	this.addWord = function(word) {
		this.addWordHelper(word, 0);
	};

	this.getTrieAtWord = function(word, pos) {
		if (pos < word.length) {
			var child = this.children[word[pos]];

			if (child !== undefined) {
				return child.getTrieAtWord(word, pos + 1);
			}
		} else {
			return this;
		}
	}

	this.countOcurrences = function(word) {
		var endTrie = this.getTrieAtWord(word, 0);
		if (endTrie === undefined) {
			return 0;
		} else {
			return endTrie.count;
		}
	}

	this.containsWord = function(word) {
		return this.countOcurrences(word) > 0;
	}

	this.numOfWords = function() {
		var count = this.count;
		for (var key in this.children) {
			count += this.children[key].numOfWords();
		}
		return count;
	}

	this.numOfDistinctWords = function() {
		var count = 0;
		if (this.count > 0) {
			count++;
		}
		for (var key in this.children) {
			count += this.children[key].numOfDistinctWords();
		}
		return count;
	}

	this.removeWord = function(word) {
		var endTrie = this.getTrieAtWord(word, 0);
		if (endTrie !== undefined) {
			endTrie.count = 0;
		}
	}

	this.removeWordOnce = function(word) {
		var endTrie = this.getTrieAtWord(word, 0);
		if (endTrie !== undefined) {
			if (endTrie.count > 0) {
				endTrie.count--;
			}
		}
	}

	this.suffixesHelper = function(prefix, endTrie, array) {
		if (endTrie.count > 0) {
			array.push(prefix);
		}
		for (var key in endTrie.children) {
			var newPrefix = prefix + key;
			this.suffixesHelper(newPrefix, endTrie.children[key], array);
		}
	}

	this.suffixes = function(prefix) {
		var words = [];

		var endTrie = this.getTrieAtWord(prefix, 0);
		if (endTrie !== undefined) {
			this.suffixesHelper(prefix, endTrie, words);
		}

		return words;
	}

	this.similarWordsHelper = function(prefix, word, dist, prevRow, row, words) {

		if (this.count > 0) {
			words.push(prefix);
		}

		for (var key in this.children) {
			var prevRowCopy = arrayCopy(prevRow);
			var rowCopy = arrayCopy(row);
			levenshteinRow(key, word, prevRowCopy, rowCopy);

			if (rowCopy[rowCopy.length - 1] <= dist) {
				this.children[key].similarWordsHelper(prefix + key, word, dist, prevRowCopy, rowCopy, words);
			}
		}
	}

	/**
	 * Returns a list of words that are a levenshtein edit distance of 'dist' or less away from 'word'
	 */
	this.similarWords = function(word, dist) {
		var words = [];

		var prevRow = [];
		var row = [];

		//fill the array with a range -- the distance to an empty string
		for (var i = 0; i <= word.length; i++) {
			prevRow.push(i);
			row.push(0);
		}

		this.similarWordsHelper("", word, dist, prevRow, row, words);

		return words;
	}

	this.toObj = function() {
		var obj = {};
		for (var letter in this.children) {
			obj[letter] = this.children[letter].toObj();
		}
		if (this.count > 0) {
			obj.count = this.count;
		}
		return obj;
	}
}