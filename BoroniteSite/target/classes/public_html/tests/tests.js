/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var arr = [1, 2, 3, 4];
QUnit.test("Contains Helper Test", function (assert) {
    assert.ok(contains(arr, 1), "Array should contain '1'");
    assert.notOk(contains(arr, 5), "Array should not contain '5'");
});

QUnit.test("IndexOf Helper Test", function (assert) {
    assert.equal(indexOf(arr, 3), 2, "Index of '3' should return 2");
    assert.equal(indexOf(arr, 17), -1, "Index of '17' should return -1");
});

//QUnit.test("DeleteOne Helper Test", function (assert) {
//    assert.equal(deleteOne(arr, 3), [1, 2, 4], "Passed");
//    assert.equal(deleteOne(arr, 12), arr, "Passed");
//    assert.equal(deleteOne(arr, 1), [2, 3, 4], "Passed");
//});

QUnit.test("ForEach Helper Test")