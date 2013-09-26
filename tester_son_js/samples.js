test("On peut créer une vue", function() {
    var view = new App.ResultsView('#results');

    ok(view);
});

test("On peut ajouter un tweet", function() {
    var view = new App.ResultsView('#results');
    view.addTweet('test');

    ok($('#results').html().match('test'));
});

test("On peut chercher des tweets", function() {
    App.Twitter.search('test', function(data) {
        ok(data.results);
    });
});

describe('Twitter service', function() {
    it('should search', function(done) {
        App.Twitter.search('test', 5, function(data) {
            data.should.have.property('results').with.lengthOf(5);
            done();
        });
    });
});

$.mockjax({
    url: '/search',
    contentType: 'text/json',
    responseTime: 750,
    responseText: { results: [...] }
});

casper.start('http://localhost/sample.html', function() {
    this.fill('#search-form', {search: 'test'}, true);
});

casper.then(function() {
    this.waitFor(function() {
        return this.evaluate(function() {
            return document.querySelectorAll('#results li').length > 0;
        });
    }, function then() {
        this.test.assertTextExists('test');
        this.captureSelector('tweets.png', '#results');
    });
});

casper.run(function() {
    this.test.renderResults(true, 0, 'test-result/tweets.xml');
});

var TwitterSearchPage = function(casper) {
    this.casper = casper;
    this.searchForm = '#search-form';
    this.results = '#results';
    this.tweets = this.results + ' li';
};
TwitterSearchPage.prototype.search = function(term) {
    this.casper.fill(this.searchForm, {search: term}, true);
};
TwitterSearchPage.prototype.waitForResults = function(then) {
    var tweetsSelector = this.tweets;
    return this.waitFor(function() {
        return this.evaluate(function(tweetsSelector) {
            return document.querySelectorAll(tweetsSelector).length > 0;
        }, tweetsSelector);
    }, then);
};

casper.start('http://localhost/sample.html');

casper.then(function() {
    var page = new TwitterSearchPage(this);
    page.search('test');
    page.waitForResults(function then() {
        this.test.assertTextExists('test');
    });
});

casper.run(function() {
    this.test.renderResults(true, 0, 'test-result/tweets.xml');
});