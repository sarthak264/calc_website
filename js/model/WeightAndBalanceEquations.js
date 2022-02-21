///
// @file    $URL: http://wally/svn/asa/CX-3/trunk/Firmware/calculator/model/include/GroundSpeedEquations.h $
// @author  $Author: george $
// @version $Rev: 581 $
// @date    $Date: 2011-11-28 15:10:52 -0800 (Mon, 28 Nov 2011) $
// @brief   Declarations of equations to calculate ground speed/time/distance.
//
// NOTE that Equation instances must not have mutable state for this to work
// (they get constructed once, globally)!
//
//#ifndef __INCLUDED_WEIGHT_BALANCE_EQUATIONS_H
//#define __INCLUDED_WEIGHT_BALANCE_EQUATIONS_H
//
//#include "definedUnits.h"
//#include "variables.h"
//#include "equations.h"
//#include "LinearEquations.h"
//#include "CX3Equations.h"

function ComputeItemWeightFromMOMandARM(weightOutput, RFinput, MoMInput, armInput) {
    Equation.call(this, weightOutput, RFinput, MoMInput, armInput);
}
ComputeItemWeightFromMOMandARM.inheritsFrom(Equation);

// compute weight 
// NOTE: moment is entered/displayed moment (MOM) = (actual moment)/RF 
//     or (actual moment) = moment*RF
// weight = (MOM*RF)/Arm
// assumes that inputs have value.
ComputeItemWeightFromMOMandARM.prototype.compute = function() {
    return this.input1() * this.input2() / this.input3();
}

ComputeItemWeightFromMOMandARM.prototype.checkPreferredUnits = function() {
    // out: weight: KGS=0, LBS
    // in: length:  M=0, FT, CM, IN
    var idx = this.inputs_[2].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // check for CM/IN 
    if (idx >= 2)
        idx -= 2;

    // if matching units - check tourqe units
    if (out_idx == idx) {
        // out: weight: KGS=0, LBS
        // in: torque:  KG=0, LB
        idx = this.inputs_[1].getUnitIndex();
    }

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeItemWeightFromMOMandARM.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


function ComputeItemMOMFromWeightAndARM(MoMOutput, RFinput, weightInput, armInput) {
    Equation.call(this, MoMOutput, RFinput, weightInput, armInput);
}
ComputeItemMOMFromWeightAndARM.inheritsFrom(Equation);

// compute moment
// NOTE: moment is entered/displayed moment (MOM) = (actual moment)/RF 
//     or (actual moment) = moment*RF
// MOM = (Wt*Arm)/RF
// assumes that inputs have value.
ComputeItemMOMFromWeightAndARM.prototype.compute = function() {
    return this.input2() * this.input3() / this.input1();
}

ComputeItemMOMFromWeightAndARM.prototype.checkPreferredUnits = function() {
    // in: length:  M=0, FT, CM, IN
    // out: torque:  KG=0, LB
    var idx = this.inputs_[2].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // check for CM/IN 
    if (idx >= 2)
        idx -= 2;

    // if matching units - check weight units
    if (out_idx == idx) {
        // in: weight: KGS=0, LBS
        // out: torque:  KG=0, LB
        idx = this.inputs_[1].getUnitIndex();
    }

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeItemMOMFromWeightAndARM.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


function ComputeItemArmFromMOMandWeight(armOutput, RFinput, MoMInput, weightInput) {
    Equation.call(this, armOutput, RFinput, MoMInput, weightInput);
}
ComputeItemArmFromMOMandWeight.inheritsFrom(Equation);

// compute Arm
// NOTE: moment is entered/displayed moment (MOM) = (actual moment)/RF 
//     or (actual moment) = moment*RF
// arm = (MOM*RF)/weight
// assumes that inputs have value.
ComputeItemArmFromMOMandWeight.prototype.compute = function() {
    return this.input1() * this.input2() / this.input3();
}

ComputeItemArmFromMOMandWeight.prototype.checkPreferredUnits = function() {
    // out: length:  M=0, FT, CM, IN
    // in: weight: KGS=0, LBS
    var idx = this.inputs_[2].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // check for M/FT change to CM/IN (don't convert short distance to long)
    if (out_idx > 1)
        idx += 2;

    // if matching units - check tourqe units
    if (out_idx == idx) {
        // in: torque:  KG=0, LB
        // out: length:  M=0, FT, CM, IN
        idx = this.inputs_[1].getUnitIndex();

        // check for M/FT change to CM/IN (don't convert short distance to long)
        if (out_idx > 1)
            idx += 2;
    }

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeItemArmFromMOMandWeight.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Weight for items 1 to 4
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalWeightItems1to4(totalWeightOut, weight1input, weight2input, weight3input, weight4input) {
    Equation.call(this, totalWeightOut, weight1input, weight2input, weight3input, weight4input);
}
ComputeTotalWeightItems1to4.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
// OR no active inputs (for intermediate values ONLY)
ComputeTotalWeightItems1to4.prototype.canCompute = function() {
    //var has_inputs = false;
    for (var i in this.inputs_) {
        // only check if varaible is active
        if (ItemStatus[i] == 2) {
            //has_inputs = true;
            if (!this.inputs_[i].hasValue())
                return false;
        }
    }
    // only valid if at least 1 active input
    //return has_inputs;

    return true;
}

// compute Total Weight (4 items)
// assumes that inputs have value.
ComputeTotalWeightItems1to4.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active inputs
        if (ItemStatus[i] == 2) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalWeightItems1to4.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}




////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Weight for items 5 to 8
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalWeightItems5to8(totalWeightOut, weight1input, weight2input, weight3input, weight4input) {
    Equation.call(this, totalWeightOut, weight1input, weight2input, weight3input, weight4input);
}
ComputeTotalWeightItems5to8.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
// OR no active inputs (for intermediate values ONLY)
ComputeTotalWeightItems5to8.prototype.canCompute = function() {
    //var has_inputs = false;
    for (var i in this.inputs_) {
        // only check if varaible is active
        if (ItemStatus[i + 4] == 2) {
            //has_inputs = true;
            if (!this.inputs_[i].hasValue())
                return false;
        }
    }
    // only valid if at least 1 active input
    //return has_inputs;

    return true;
}

// compute Total Weight (4 items)
// assumes that inputs have value.
ComputeTotalWeightItems5to8.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active inputs
        if (ItemStatus[i + 4] == 2) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalWeightItems5to8.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}




////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Weight (up to 8 items)
///
///
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalWeightUpTo8items(totalWeightOut, totalWeightAinput, totalWeightBinput) {
    Equation.call(this, totalWeightOut, totalWeightAinput, totalWeightBinput);
}
ComputeTotalWeightUpTo8items.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
ComputeTotalWeightUpTo8items.prototype.canCompute = function() {
    var has_inputs = false;
    for (var i = 0; i < CONST.MAX_ITEMS; i++) {
        // only check if varaible is active
        if (ItemStatus[i] == 2) {
            has_inputs = true;
            // check totals (4/input)
            if (i < 4) {
                if (!this.inputs_[0].hasValue())
                    return false;
            } else {
                if (!this.inputs_[1].hasValue())
                    return false;
            }
        }
    }
    // only valid if at least 1 active input
    return has_inputs;
}

// compute Total Weight (4 items)
// assumes that inputs have value.
ComputeTotalWeightUpTo8items.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active totals
        if (this.inputs_[i].hasValue()) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalWeightUpTo8items.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}




////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Moment for Items 1 to 4
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalMomentItems1to4(totalMomentOut, moment1input, moment2input, moment3input, moment4input) {
    Equation.call(this, totalMomentOut, moment1input, moment2input, moment3input, moment4input);
}
ComputeTotalMomentItems1to4.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values 
// OR no active inputs (for intermediate values ONLY)
ComputeTotalMomentItems1to4.prototype.canCompute = function() {
    //var has_inputs = false;
    for (var i in this.inputs_) {
        // only check if varaible is active
        if (ItemStatus[i] == 2) {
            //has_inputs = true;
            if (!this.inputs_[i].hasValue())
                return false;
        }
    }
    // only valid if at least 1 active input
    //return has_inputs;

    // all active inputs have valid value, or there are no active inputs
    return true;
}

// compute Total Moment (4 items)
// assumes that inputs have value.
ComputeTotalMomentItems1to4.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active inputs
        if (ItemStatus[i] == 2) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalMomentItems1to4.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Moment for Items 5 to 8
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalMomentItems5to8(totalMomentOut, moment1input, moment2input, moment3input, moment4input) {
    Equation.call(this, totalMomentOut, moment1input, moment2input, moment3input, moment4input);
}
ComputeTotalMomentItems5to8.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
// OR no active inputs (for intermediate values ONLY)
ComputeTotalMomentItems5to8.prototype.canCompute = function() {
    //var has_inputs = false;
    for (var i in this.inputs_) {
        // only check if varaible is active
        if (ItemStatus[i + 4] == 2) {
            //has_inputs = true;
            if (!this.inputs_[i].hasValue())
                return false;
        }
    }
    // only valid if at least 1 active input
    //return has_inputs;

    return true;
}

// compute Total Moment (4 items)
// assumes that inputs have value.
ComputeTotalMomentItems5to8.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active inputs
        if (ItemStatus[i + 4] == 2) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalMomentItems5to8.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Total Moment for up to 8 Items
///
////////////////////////////////////////////////////////////////////////////////
function ComputeTotalMomentUpTo8Items(totalMomentOut, momentAinput, momentBinput) {
    Equation.call(this, totalMomentOut, momentAinput, momentBinput);
}
ComputeTotalMomentUpTo8Items.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
ComputeTotalMomentUpTo8Items.prototype.canCompute = function() {
    var has_inputs = false;
    for (var i = 0; i < CONST.MAX_ITEMS; i++) {
        // only check if varaible is active
        if (ItemStatus[i] == 2) {
            has_inputs = true;
            // check totals (4/input)
            if (i < 4) {
                if (!this.inputs_[0].hasValue())
                    return false;
            } else {
                if (!this.inputs_[1].hasValue())
                    return false;
            }
        }
    }
    // only valid if at least 1 active input
    return has_inputs;
}

// compute Total Moment (4 items)
// assumes that inputs have value.
ComputeTotalMomentUpTo8Items.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // only get active totals
        if (this.inputs_[i].hasValue()) {
            out += this.inputs_[i].value();
        }
    }

    return out;
}

ComputeTotalMomentUpTo8Items.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Dummy to check for unit changes
///    default unit: CONST.WeightDefault
///
////////////////////////////////////////////////////////////////////////////////
function ComputeWeightFromWeightCheckLength(weightOutput, weightInput, lengthInput) {
    Equation.call(this, weightOutput, weightInput, lengthInput);
}
ComputeWeightFromWeightCheckLength.inheritsFrom(Equation);

// implementation: can compute - ONLY check weightInput (others look for unit changes only)
ComputeWeightFromWeightCheckLength.prototype.canCompute = function() {
    return this.inputs_[0].hasValue();
}

// compute angle
// assumes that inputs have value.
ComputeWeightFromWeightCheckLength.prototype.compute = function() {
    return this.input1();
}

ComputeWeightFromWeightCheckLength.prototype.checkPreferredUnits = function() {
    // out: weight: KGS=0, LBS
    // in: length:  M=0, FT, CM, IN
    var idx = this.inputs_[1].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // check for CM/IN 
    if (idx >= 2)
        idx -= 2;

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeWeightFromWeightCheckLength.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Dummy to check for unit changes
///    default unit: CONST.TorqueDefault
///
////////////////////////////////////////////////////////////////////////////////
function ComputeMomentFromMomentCheckLength(momOutput, momInput, lengthInput) {
    Equation.call(this, momOutput, momInput, lengthInput);
}
ComputeMomentFromMomentCheckLength.inheritsFrom(Equation);

// implementation: can compute - ONLY check momInput (others look for unit changes only)
ComputeMomentFromMomentCheckLength.prototype.canCompute = function() {
    return this.inputs_[0].hasValue();
}

// compute angle
// assumes that inputs have value.
ComputeMomentFromMomentCheckLength.prototype.compute = function() {
    return this.input1();
}

ComputeMomentFromMomentCheckLength.prototype.checkPreferredUnits = function() {
    // out: torque: KG-M (NM) =0, LB-IN
    // in: length:  M=0, FT, CM, IN
    var idx = this.inputs_[1].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // check for CM/IN 
    if (idx >= 2)
        idx -= 2;

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeMomentFromMomentCheckLength.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   Aircraft Profile - Weight and Balance Equations

////////////////////////////////////////////////////////////////////////////////
///  
///   Check for valid Aircraft Profile Weight and Balance input item 
///  Item is valid if all inputs have values 
///
////////////////////////////////////////////////////////////////////////////////
function CheckForItemValidThreeInputs(itemOutput, itemInput1, itemInput2, itemInput3) {
    Equation.call(this, itemOutput, itemInput1, itemInput2, itemInput3);
}
CheckForItemValidThreeInputs.inheritsFrom(Equation);

// always return 1.0
// assumes that inputs have value.
CheckForItemValidThreeInputs.prototype.compute = function() {
    return 1.0;
}


function CheckForItemValidFourInputs(itemOutput, itemInput1, itemInput2, itemInput3, itemInput4) {
    Equation.call(this, itemOutput, itemInput1, itemInput2, itemInput3, itemInput4);
}
CheckForItemValidFourInputs.inheritsFrom(Equation);

// always return 1.0
// assumes that inputs have value.
CheckForItemValidFourInputs.prototype.compute = function() {
    return 1.0;
}



function CheckForItemValidTwoInputs(itemOutput, itemInput1, itemInput2) {
    Equation.call(this, itemOutput, itemInput1, itemInput2);
}
CheckForItemValidTwoInputs.inheritsFrom(Equation);

// always return 1.0
// assumes that inputs have value.
CheckForItemValidTwoInputs.prototype.compute = function() {
    return 1.0;
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Aircraft Profile Compute Total Weight for 4 items
///
////////////////////////////////////////////////////////////////////////////////
function ComputeProfileTotalWeight4Items(totalWeightOut, weight1input, weight2input, weight3input, weight4input) {
    Equation.call(this, totalWeightOut, weight1input, weight2input, weight3input, weight4input);
}
ComputeProfileTotalWeight4Items.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
// OR no active inputs (for intermediate values ONLY)
// TODO: only add active items 
/*
   virtual var canCompute() {
//var has_inputs = false;
for (int i = 0; i < this.nInputs_; i++) {
assert(this.inputs_[i] != 0);
// only check if varaible is active
if (ItemStatus[i] == 2) {
//has_inputs = true;
if (!this.inputs_[i].hasValue())
return false;
}
}
// only valid if at least 1 active input
//return has_inputs;

return true;
} */

// compute Total Weight (4 items)
// assumes that inputs have value.
ComputeProfileTotalWeight4Items.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // TODO: only get active inputs
        //if (ItemStatus[i] == 2) {
        out += this.inputs_[i].value();
        //}
    }

    return out;
}

ComputeProfileTotalWeight4Items.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Aircraft Profile Compute Total Moment for 4 items
///
////////////////////////////////////////////////////////////////////////////////
function ComputeProfileTotalMoment4Items(totalMomentOut, moment1input, moment2input, moment3input, moment4input) {
    Equation.call(this, totalMomentOut, moment1input, moment2input, moment3input, moment4input);
}
ComputeProfileTotalMoment4Items.inheritsFrom(Equation);

// implementation: can compute if all acitve inputs have values
// OR no active inputs (for intermediate values ONLY)
// TODO: only add active items 
/*
   virtual var canCompute() {
//var has_inputs = false;
for (int i = 0; i < this.nInputs_; i++) {
assert(this.inputs_[i] != 0);
// only check if varaible is active
if (ItemStatus[i] == 2) {
//has_inputs = true;
if (!this.inputs_[i].hasValue())
return false;
}
}
// only valid if at least 1 active input
//return has_inputs;

return true;
} */

// compute Total Moment (4 items)
// assumes that inputs have value.
ComputeProfileTotalMoment4Items.prototype.compute = function() {
    var out = 0;
    for (var i in this.inputs_) {
        // TODO: only get active inputs
        //if (ItemStatus[i] == 2) {
        out += this.inputs_[i].value();
        //}
    }

    return out;
}

ComputeProfileTotalMoment4Items.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.TorqueDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Dummy to set prefered units for fuel volume  check fuel arm (length) units
///    default unit: CONST.VolumeDefault
///
////////////////////////////////////////////////////////////////////////////////
function ComputeVolumeFromVolumeCheckLength(volOutput, volInput, lengthInput) {
    Equation.call(this, volOutput, volInput, lengthInput);
}
ComputeVolumeFromVolumeCheckLength.inheritsFrom(Equation);

// implementation: can compute - ONLY check rateInput (others look for unit changes only)
ComputeVolumeFromVolumeCheckLength.prototype.canCompute = function() {
    return this.inputs_[0].hasValue();
}

// compute angle
// assumes that inputs have value.
ComputeVolumeFromVolumeCheckLength.prototype.compute = function() {
    return this.input1();
}

ComputeVolumeFromVolumeCheckLength.prototype.checkPreferredUnits = function() {
    var idx = this.inputs_[1].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // out: fuel vol: liters=0, US GAL, UK GAL, US QT, UK QT
    // in:    length:      M=0, FT, CM, IN

    // check using M or FT
    if (idx > 2)
        idx -= 2;

    // check for switch between US/UK QT
    if (out_idx > 2)
        idx = 4 - idx;
    // check for conversion from UK to US GAL (no change back, next change will show liters)
    else if (out_idx == 2)
        idx = 2 - idx;

    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }

}

ComputeVolumeFromVolumeCheckLength.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.VolumeDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   Weight and Shift Formula Equations

////////////////////////////////////////////////////////////////////////////////
///  
///  Compute change in Arm
///
////////////////////////////////////////////////////////////////////////////////

function ComputeChangeInArm(dArmOutput, itemWtinput, totalWtInput, dCGinput) {
    Equation.call(this, dArmOutput, itemWtinput, totalWtInput, dCGinput);
}
ComputeChangeInArm.inheritsFrom(Equation);

// compute change in Arm
// (itemWt/totalWt) = (dCG/dArm)
//   dArm = (dCG*totalWt)/(itemWt)
// assumes that inputs have value.
ComputeChangeInArm.prototype.compute = function() {
    return this.input3() * this.input2() / this.input1();
}

ComputeChangeInArm.prototype.checkPreferredUnits = function() {
    // use item wt input
    var idx = this.inputs_[0].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // in: weight: KGS=0, LBS
    // out: length:  M=0, FT, CM, IN
    // check for M/FT change to KM/SM (don't convert short distance to long)
    if (out_idx > 1)
        idx += 2;
    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeChangeInArm.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}



////////////////////////////////////////////////////////////////////////////////
///  
///  Compute change in CG
///
////////////////////////////////////////////////////////////////////////////////

function ComputeChangeInCG(dCGOutput, itemWtinput, totalWtInput, dArminput) {
    Equation.call(this, dCGOutput, itemWtinput, totalWtInput, dArminput);
}
ComputeChangeInCG.inheritsFrom(Equation);

// compute change in Arm
// (itemWt/totalWt) = (dCG/dArm)
//   dCG = (dArm*itemWt)/(totalWt)
// assumes that inputs have value.
ComputeChangeInCG.prototype.compute = function() {
    return this.input3() * this.input1() / this.input2();
}

ComputeChangeInCG.prototype.checkPreferredUnits = function() {
    // use item wt input
    var idx = this.inputs_[0].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // in: weight: KGS=0, LBS
    // out: length:  M=0, FT, CM, IN
    // check for M/FT change to KM/SM (don't convert short distance to long)
    if (out_idx > 1)
        idx += 2;
    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeChangeInCG.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute item weight
///
////////////////////////////////////////////////////////////////////////////////

function ComputeChangeInItemWt(itemWtOutput, dArminput, totalWtInput, dCGinput) {
    Equation.call(this, itemWtOutput, dArminput, totalWtInput, dCGinput);
}
ComputeChangeInItemWt.inheritsFrom(Equation);

// compute change in Arm
// (itemWt/totalWt) = (dCG/dArm)
//   itemWt = (dCG*totalWt)/(dArm)
// assumes that inputs have value.
ComputeChangeInItemWt.prototype.compute = function() {
    return this.input3() * this.input2() / this.input1();
}

ComputeChangeInItemWt.prototype.checkPreferredUnits = function() {
    // use  dArm input
    var idx = this.inputs_[0].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // in: length:  M=0, FT, CM, IN
    // out: weight: KGS=0, LBS
    // check for M/FT change to KM/SM (don't convert short distance to long)
    if (idx > 1)
        idx -= 2;
    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeChangeInItemWt.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute total weight 
///
////////////////////////////////////////////////////////////////////////////////

function ComputeChangeInTotalWt(totalWtOutput, itemWtinput, dArmInput, dCGinput) {
    Equation.call(this, totalWtOutput, itemWtinput, dArmInput, dCGinput);
}
ComputeChangeInTotalWt.inheritsFrom(Equation);

// compute change in Arm
// (itemWt/totalWt) = (dCG/dArm)
//   totalWt = (dArm*itemWt)/(dCG)
// assumes that inputs have value.
ComputeChangeInTotalWt.prototype.compute = function() {
    return this.input1() * this.input2() / this.input3();
}

ComputeChangeInTotalWt.prototype.checkPreferredUnits = function() {
    // use  dArm input
    var idx = this.inputs_[1].getUnitIndex();
    var out_idx = this.output_.getUnitIndex();
    // in: length:  M=0, FT, CM, IN
    // out: weight: KGS=0, LBS
    // check for M/FT change to KM/SM (don't convert short distance to long)
    if (idx > 1)
        idx -= 2;
    // make sure matching units
    if (out_idx != idx) {
        // update preferred units  indicate output (unit) changed
        this.preferredUnits_.ptr = this.output_.kind().units()[idx];
        this.output_.kind().setDefaultUnit(this.preferredUnits_.ptr);
        this.output_.setUnitLock(true);
        this.output_.changed();
    }
}

ComputeChangeInTotalWt.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.WeightDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///   Percent MAC Equations

////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Percent Mean Aerodynamic Chord
///
////////////////////////////////////////////////////////////////////////////////

function ComputePercentMAC(PercentMACoutput, MACinput, MacCGinput, LMACinput) {
    Equation.call(this, PercentMACoutput, MACinput, MacCGinput, LMACinput);
}
ComputePercentMAC.inheritsFrom(Equation);

// compute %MAC
// %MAC = (CG - LMAC)/MAC

// assumes that inputs have value.
ComputePercentMAC.prototype.compute = function() {
    return (this.input2() - this.input3()) / this.input1();
}

ComputePercentMAC.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(false);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.PercentDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Mean Aerodynamic Chord
///
////////////////////////////////////////////////////////////////////////////////

function ComputeMAC(MACoutput, PercentMACinput, MacCGinput, LMACinput) {
    Equation.call(this, MACoutput, PercentMACinput, MacCGinput, LMACinput);
}
ComputeMAC.inheritsFrom(Equation);

// compute %MAC
// %MAC = (CG - LMAC)/MAC
//  MAC = (CG - LMAC)/%MAC
// assumes that inputs have value.
ComputeMAC.prototype.compute = function() {
    return (this.input2() - this.input3()) / this.input1();
}

ComputeMAC.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Center of Gravity
///
////////////////////////////////////////////////////////////////////////////////

function ComputeMacCG(MacCGoutput, PercentMACinput, MACinput, LMACinput) {
    Equation.call(this, MacCGoutput, PercentMACinput, MACinput, LMACinput);
}
ComputeMacCG.inheritsFrom(Equation);

// compute %MAC
// %MAC = (CG - LMAC)/MAC
//  CG = MAC*(%MAC) + LMAC
// assumes that inputs have value.
ComputeMacCG.prototype.compute = function() {
    return (this.input1() * this.input2()) + this.input3();
}

ComputeMacCG.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}


////////////////////////////////////////////////////////////////////////////////
///  
///  Compute Leading Edge of MAC
///
////////////////////////////////////////////////////////////////////////////////

function ComputeLMAC(LMACoutput, PercentMACinput, MACinput, CGinput) {
    Equation.call(this, LMACoutput, PercentMACinput, MACinput, CGinput);
}
ComputeLMAC.inheritsFrom(Equation);

// compute %MAC
// %MAC = (CG - LMAC)/MAC
//  LMAC = CG - MAC*(%MAC)
// assumes that inputs have value.
ComputeLMAC.prototype.compute = function() {
    return this.input3() - (this.input1() * this.input2());
}

ComputeLMAC.prototype.setPreferredUnits = function() {
    this.output_.setUseDefaultUnit(true);

    if (this.preferredUnits_.ptr == null)
        this.preferredUnits_.ptr = CONST.LengthDefault;
    this.output_.setPreferredUnit(this.preferredUnits_);
}