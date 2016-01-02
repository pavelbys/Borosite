/*jslint white: true */


var typeCode = new DecisionTable("Type Code", ["Rule1", "Fish"], ["C1", "C2", "C3"], ["A1", "A2", "A3"], {
    "Rule1": {
        "C1": "true",
        "C2": ">21",
        "C3": "0",
        "A1": "123",
        "A2": "Swordfish",
        "A3": ".0731"
    },
    "Fish": {
        "C1": ">=10",
        "C2": "false",
        "C3": "-",
        "A1": "16",
        "A2": "trout",
        "A3": "3.141"
    }
}, {
    "C1": ['foo', 'bar'],
    "C2": ['foo', 'bar'],
    "C3": ['foo', 'bar'],
    "A1": ['foo', 'bar'],
    "A2": ['foo', 'bar'],
    "A3": ['foo', 'bar']
});


var table1 = new DecisionTable("table1", ["R1", "R2"], ["C1", "C2", "C3"], ["A1"], {
    "R1": {
        "C1": "foo",
        "C2": "bar",
        "C3": "derp",
        "A1": "act!"
    },
    "R2": {
        "C1": "asdf",
        "C2": "ghjk",
        "C3": "qwert",
        "A1": "run you fools!"
    }
}, {
    "C1": ['foo', 'bar'],
    "C2": ['foo', 'bar'],
    "C3": ['foo', 'bar'],
    "A1": ['foo', 'bar']
});

var table2 = new DecisionTable("table2", ["Rule 1"], ["Type Code", "Reference Number", "Transaction Date", "Tax Period"], ["Matches?"], {
    "Rule 1": {
        "Type Code": "767",
        "Reference Number": "356, 357, or 438",
        "Transaction Date": "766 Transaction Date",
        "Tax Period": "< 200812 OR > 200911",
        "Matches?": "true"
    }
}, {
    "Type Code": ["767", "766"],
    "Reference Number": ["356, 357, or 438", "454"],
    "Transaction Date": ["766 Transaction Date", "767 Transaction Date"],
    "Tax Period": ["< 200812 OR > 200911", "<200812"],
    "Matches?": ["true", "false"]
});

var table3 = new DecisionTable("table3", ["R1", "R2", "R3"], ["C1", "C2", "C3"], ["A1", "A2"], {
    "R1": {
        "C1": "foo",
        "C2": "bar",
        "C3": "derp",
        "A1": "goo",
        "A2": "asdf"
    },
    "R2": {
        "C1": "asdf",
        "C2": "ghjk",
        "C3": "qwert",
        "A1": "goo",
        "A2": "asdf"
    },
    "R3": {
        "C1": "kjsg",
        "C2": "fkjhsg",
        "C3": "slkgjhsfg",
        "A1": "goo",
        "A2": "asdf"
    }
}, {
    "C1": ['foo', 'bar'],
    "C2": ['foo', 'bar'],
    "C3": ['foo', 'bar'],
    "A1": ['foo', 'bar'],
    "A2": ['foo', 'bar']
});

var table2Copy = DecisionTables.copy(table2);


var refundableCreditTabling = new DecisionTable2('Refundable Credit Tabling')
        .addConditionClass('Transaction', ['Type Code', 'Reference Number', 'Cycle Posted'])
        .addConditionClass('Tax Module', ['Tax Period'])
        .addConditionClass('Matching 767 for 766', ['Matching 767'])
        .addResultClass('Tabled Transaction', ['Transaction Amount', 'Reference Flag'])
        .addRule('Rule 1', ['766', '356, 357, or 438', '>= 20032208', '< 200812 OR > 200911', 'true', 'Minimum of (766 Transaction Amount + 767 Transaction Amount) OR 0', '48'])
        .addRule('Rule 2', ['766', '356, 357, or 438', '>= 20032208', '< 200812 OR > 200911', 'false', '', '48'])
        .addRule('Rule 3', ['766', '356, 357, or 438', '>= 20032208', '-', '-', '', '48']);

var matching = new DecisionTable2('Matching 767 for 766')
        .addConditionClass('Transaction', ['Type Code', 'Reference Number', 'Transaction Date'])
        .addConditionClass('Tax Module', ['Tax Period'])
        .addResultClass('', ['Matches?'])
        .addRule('Rule 1', ['767', '356, 357, or 438', '766 Transaction Date', '< 200812 OR > 200911', 'true']);

var page147 = new DecisionTable2('Application risk score model')
        .addConditionClass('Applicant', ['Age', 'Marital Status', 'Employment Status'])
        .addResultClass('Score', ['Partial Score'])
        .addRule('1', ['[18..21]', '-', '-', '32'])
        .addRule('2', ['[22..25]', '-', '-', '35'])
        .addRule('3', ['[26..35]', '-', '-', '40'])
        .addRule('4', ['[36..49]', '-', '-', '43'])
        .addRule('5', ['>=50', '-', '-', '48'])
        .addRule('6', ['-', 'S', '-', '25'])
        .addRule('7', ['-', 'M', '-', '45'])
        .addRule('8', ['-', '-', 'UNEMPLOYED', '15'])
        .addRule('9', ['-', '-', 'STUDENT', '18'])
        .addRule('10', ['-', '-', 'EMPLOYED', '45'])
        .addRule('11', ['-', '-', 'SELF-EMPLOYED', '36'])


var newTables = {};
newTables[refundableCreditTabling.name] = refundableCreditTabling;
newTables[matching.name] = matching;
newTables[page147.name] = page147;

var hardCodedTables = {};
hardCodedTables[table1.name] = table1;
hardCodedTables[typeCode.name] = typeCode;
hardCodedTables[table2.name] = table2;
hardCodedTables[table2Copy.name] = table2Copy;
hardCodedTables[table3.name] = table3;
hardCodedTables["blank"] = new DecisionTable("blank", [], [], [], {}, {});
//hardCodedTables[refundableCreditTabling.name] = refundableCreditTabling;
//hardCodedTables[matching.name] = matching;
//console.log(hardCodedTables['Refundable Credit Tabling']);