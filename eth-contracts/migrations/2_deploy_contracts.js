// migrating the appropriate contracts
var Verifier = artifacts.require("./../contracts/Verifier.sol");
var SolnSquareVerifier = artifacts.require("./../contracts/SolnSquareVerifier.sol");

module.exports = function (deployer) {
  deployer.deploy(Verifier);
  deployer.deploy(SolnSquareVerifier);
};