'use strict';

var helper      = require('../../test-helper');
var chai        = require('chai');
var path        = require('path');
var assert      = chai.assert;

chai.use(require('chai-fs'));

describe('mavensmate new-metadata', function(){

  var project;
  var testClient;

  before(function(done) {
    this.timeout(120000);
    testClient = helper.createClient('unittest');
    helper.unlinkEditor();
    helper.putTestProjectInTestWorkspace(testClient, 'new-metadata');
    helper.addProject(testClient, 'new-metadata')
      .then(function(proj) {
        project = proj;
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  after(function(done) {
    this.timeout(120000);
    var filesToDelete = [
      path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'classes', 'NewMetadataClass.cls'),
      path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'triggers', 'NewMetadataTrigger.trigger'),
    ];
    helper.cleanUpTestData(testClient, filesToDelete)
      .catch(function(err) {
        done(err);
      })
      .finally(function() {
        helper.cleanUpTestProject('new-metadata');
        done();
      });
  });


  it('should create new Apex Class on the server', function(done) {
    this.timeout(120000);

    helper.createNewMetadata(testClient, 'ApexClass', 'NewMetadataClass')
      .then(function(response) {
        response.message.should.equal('Success');
        assert.isFile(path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'classes', 'NewMetadataClass.cls'),  'Class file not created');
        assert.isFile(path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'classes', 'NewMetadataClass.cls-meta.xml'),  'Class meta file not created');
        testClient.getProject().packageXml.subscription.should.have.property('ApexClass');
        testClient.getProject().packageXml.subscription.ApexClass.length.should.equal(1);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('should create new Apex Trigger on the server', function(done) {
    this.timeout(120000);

    helper.createNewMetadata(testClient, 'ApexTrigger', 'NewMetadataTrigger', 'ApexTrigger.trigger', { api_name : 'NewMetadataTrigger', object_name : 'Account' } )
      .then(function(response) {
        response.message.should.equal('Success');
        assert.isFile(path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'triggers', 'NewMetadataTrigger.trigger'),  'Trigger file not created');
        assert.isFile(path.join(helper.baseTestDirectory(),'workspace', 'new-metadata', 'src', 'triggers', 'NewMetadataTrigger.trigger-meta.xml'),  'Trigger meta file not created');
        testClient.getProject().packageXml.subscription.should.have.property('ApexTrigger');
        testClient.getProject().packageXml.subscription.ApexTrigger.length.should.equal(1);
        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

});

