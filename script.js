'use strict'

const AFRONTLINER = "AFrontliner";
const ASUPPORT = "ASupport";
const DFRONTLINER = "DFrontliner";
const DSUPPORT = "DSupport";
const DEFAULT_SIMULATION_VALUE = 1;

/**
 * Function that sets event handlers after the page is finished loading.
 */
window.onload = function(){

    document.getElementById("simulateButton").addEventListener("click", simulate);

};

/**
 * 
 */
function simulate() 
{
    let profiles = loadProfiles();
    let simulationAmount = getSimulationAmount();
    console.log(simulationAmount);
    let attackerDuelBundle = getDuelBundle(profiles, AFRONTLINER, ASUPPORT);
    let defenderDuelBundle = getDuelBundle(profiles, DFRONTLINER, DSUPPORT);

    let result = prepareResult();

    let simulationResult = run(simulationAmount, [], result);
    

    console.log(attackerDuelBundle);
    console.log(defenderDuelBundle);
};

function run(simulationAmount, attackerDuelBundle, defenderDuelBundle, bouts, result){
    if(simulationAmount == 0){
        //result.Bouts = bouts;
        return result;
    }else{
        let bout = resolveBout(attackerDuelBundle, defenderDuelBundle);
        run(simulationAmount - 1, attackerDuelBundle, defenderDuelBundle, bouts, result);
    }
}

/**
 * Function that resolves an engagement, hereby bout. At the moment this is limited to duels, but should be expanded to wounding.
 * @param {*} attackerDuelBundle 
 * @param {*} defenderDuelBundle 
 */
function resolveBout(attackerDuelBundle, defenderDuelBundle){
    console.log("In Resolve Bout");
    let attackerRolls = Array.from(Array(length), () => {
        return rollDice();
      });;
    let defenderRolls = Array(defenderDuelBundle.Attack).fill(rollDice());

    console.log(attackerRolls);
    console.log(defenderRolls);
}

function rollDice(){
    return Math.floor(Math.random() * 6) + 1;
}

function prepareResult(){
    return {
        AttackerWins: 0,
        DefenderWins: 0,
        TotalFights: 0,
    }
}

function getSimulationAmount(){
    let simulationAmountValue = document.getElementById("simulateAmount").value;
    if(simulationAmountValue == ""){
        return DEFAULT_SIMULATION_VALUE;
    } else {
        return simulationAmountValue;
    }
}

/**
 * Function that reads and loads in all the profiles.
 * @returns 
 */
function loadProfiles(){
    return [
        retrieveProfile(AFRONTLINER),
        retrieveProfile(ASUPPORT),
        retrieveProfile(DFRONTLINER),
        retrieveProfile(DSUPPORT)
    ].filter(profile => profile.IsActive);
}

function getProfile(profiles, profileIdentifier){
    for(let i = 0; i < profiles.length; i++){
        if(profiles[i].Name == profileIdentifier){
            return profiles[i];
        }
    }
    return null;
}

function getDuelBundle(profiles, frontliner, support){
    let bundle = {};
    let frontlinerProfile = getProfile(profiles, frontliner)
    let supportProfile = getProfile(profiles, support);
    
    if(supportProfile != null){
        bundle.Fight = frontlinerProfile.Fight > supportProfile.Fight ? frontlinerProfile.Fight : supportProfile.Fight;
        bundle.Attack = frontlinerProfile.Attack + supportProfile.Attack;
        bundle.HasBanner = frontlinerProfile.Banner || supportProfile.Banner;
        bundle.HasElvenBlade = frontlinerProfile.ElvenBlade || supportProfile.ElvenBlade;
    } else {
        bundle.Fight = frontlinerProfile.Fight;
        bundle.Attack = frontlinerProfile.Attack;
        bundle.HasBanner = frontlinerProfile.Banner;
        bundle.HasElvenBlade = frontlinerProfile.ElvenBlade;
    }

    return bundle;
}


/**
 * Function that reads a certain profile from the simulator data based on a profile identifier.
 * @param {*} profileIdentifier 
 * @returns 
 */
function retrieveProfile(profileIdentifier){
    let profile = {}

    profile.Name = profileIdentifier;
    profile.Fight = parseInt(document.getElementById(profileIdentifier + "Fight").value);
    profile.Strength = parseInt(document.getElementById(profileIdentifier + "Strength").value);
    profile.Defence = parseInt(document.getElementById(profileIdentifier + "Defence").value);
    profile.Attack = parseInt(document.getElementById(profileIdentifier + "Attack").value);
    profile.Courage = parseInt(document.getElementById(profileIdentifier + "Courage").value);
    profile.Banner = document.getElementById(profileIdentifier + "Banner").checked;
    profile.ElvenBlade = document.getElementById(profileIdentifier + "ElvenBlade").checked;
    profile.IsActive = document.getElementById(profileIdentifier + "Active").checked;

    return profile;
}