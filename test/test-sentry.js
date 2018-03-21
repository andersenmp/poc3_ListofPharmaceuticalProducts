var expect  = require('chai').expect;
var SentryUtils = require('../Library/SentryUtils')



it('it does not have Access to Feature', function(done) {
    var sentry = new SentryUtils('');
    sentry.hasAccessToFeature('/ADMINISTRATOR').then(function (access) {
        expect(access).to.be.false;
        done();
    })
});

it('It has Access to Feature', function(done) {
    var sentry = new SentryUtils('ipecoran');
    sentry.hasAccessToFeature('/ADMINISTRATOR').then(function (access) {
        expect(access).to.be.true;
        done();
    })
});



