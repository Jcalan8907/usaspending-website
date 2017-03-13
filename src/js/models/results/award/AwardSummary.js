/**
  * AwardSummary.js
  * Created by Kevin Li 11/28/16
  **/

import moment from 'moment';

import * as MoneyFormatter from 'helpers/moneyFormatter';

import GenericRecord from '../GenericRecord';

const recordType = 'award';
const fields = [
    'id',
    'award_id',
    'recipient_name',
    'description',
    'date_signed',
    'period_of_performance_start_date',
    'period_of_performance_current_end_date',
    'award_type',
    'type',
    'type_description',
    'awarding_agency_name',
    'awarding_subtier_name',
    'awarding_office_name',
    'funding_agency_name',
    'funding_subtier_name',
    'funding_office_name',
    'recipient_street',
    'recipient_city',
    'recipient_state_province',
    'recipient_zip_postal',
    'recipient_country',
    'pop_city',
    'parent_award',
    'pop_state_province',
    'pop_zip',
    'total_obligation',
    'potential_total_value_of_award',
    'recipient_duns',
    'recipient_parent_duns',
    'recipient_business_type',
    'type_of_contract_pricing',
    'type_of_contract_pricing_description',
    'latest_transaction'
];

const remapData = (data, idField) => {
    // remap expected child fields to top-level fields
    const remappedData = data;
    let id = 0;
    let awardType = '';
    let awardTypeDescription = '';
    let awardDescription = '';
    let awardingAgencyName = '';
    let awardingSubtierName = '';
    let awardingOfficeName = '';
    let fundingAgencyName = '';
    let fundingSubtierName = '';
    let fundingOfficeName = '';
    let recipientName = '';
    let recipientStreet = '';
    let recipientCity = '';
    let recipientStateProvince = '';
    let recipientZipPostal = '';
    let recipientCountry = '';
    let recipientDuns = '';
    let recipientParentDuns = '';
    let recipientBusinessType = '';
    let popCity = '';
    let popStateProvince = '';
    let popZip = '';
    let contractPricingCode = '';
    let contractPricing = '';

    if (data.id) {
        id = data.id;
    }

    if (data.type) {
        awardType = data.type;
    }

    if (data.type_description) {
        awardTypeDescription = data.type_description;
    }

    if (data.description) {
        awardDescription = data.description;
    }

    if (data.awarding_agency) {
        awardingAgencyName = data.awarding_agency.toptier_agency.name;
        awardingSubtierName = data.awarding_agency.subtier_agency.name;
        if (data.awarding_agency.office_agency) {
            awardingOfficeName = data.awarding_agency.office_agency.name;
        }
    }

    if (data.funding_agency) {
        fundingAgencyName = data.funding_agency.toptier_agency.name;
        fundingSubtierName = data.funding_agency.subtier_agency.name;
        if (data.funding_agency.office_agency) {
            fundingOfficeName = data.funding_agency.office_agency.name;
        }
    }

    if (data.place_of_performance) {
        popCity = data.place_of_performance.city_name;

        if (popCity !== null && data.place_of_performance.state_code) {
            popStateProvince = data.place_of_performance.state_code;
        }
        else if (popCity === null && data.place_of_performance.state_name) {
            popStateProvince = data.place_of_performance.state_name;
        }
        else if (popCity === null && !data.place_of_performance.state_name) {
            popStateProvince = data.place_of_performance.state_code;
        }
        else if (data.place_of_performance.foreign_province) {
            popStateProvince = data.place_of_performance.foreign_province;
        }
        popZip = data.place_of_performance.zip5;
    }

    remappedData.id = id;
    remappedData.award_type = awardType;
    remappedData.type_description = awardTypeDescription;
    remappedData.description = awardDescription;
    remappedData.awarding_agency_name = awardingAgencyName;
    remappedData.awarding_subtier_name = awardingSubtierName;
    remappedData.awarding_office_name = awardingOfficeName;
    remappedData.funding_agency_name = fundingAgencyName;
    remappedData.funding_subtier_name = fundingSubtierName;
    remappedData.funding_office_name = fundingOfficeName;
    remappedData.pop_city = popCity;
    remappedData.pop_state_province = popStateProvince;
    remappedData.pop_zip = popZip;

    // set the awardID (fain or piid) to the relevant field
    let awardId = data.fain;
    if (!idField) {
        // unspecified ID field, use whatever value is available
        if (!data.fain && data.piid) {
            awardId = data.piid;
        }
        else if (data.uri) {
            awardId = data.uri;
        }
    }
    else {
        awardId = data[idField];
        if (!awardId) {
            awardId = '';
        }
    }
    remappedData.award_id = awardId;

    // Format Recipient Info + Address
    if (data.recipient) {
        recipientName = data.recipient.recipient_name;
        const loc = data.recipient.location;

        if (loc.address_line1) {
            recipientStreet += loc.address_line1;
        }
        if (loc.address_line2) {
            recipientStreet += loc.laddress_line2;
        }
        if (loc.address_line2) {
            recipientStreet += loc.address_line3;
        }

        if (loc.city_name) {
            recipientCity = loc.city_name;
        }

        if (loc.state_code) {
            recipientStateProvince = loc.state_code;
        }
        else if (loc.foreign_province) {
            recipientStateProvince = loc.foreign_province;
        }

        if (loc.zip5) {
            recipientZipPostal = loc.zip5;
        }
        else if (loc.foreign_postal_code) {
            recipientZipPostal = loc.foreign_postal_code;
        }

        if (loc.location_country_code) {
            recipientCountry = loc.country_name;
        }
        else if (loc.country_name) {
            recipientCountry = loc.country_name;
        }
        if (data.recipient.recipient_unique_id) {
            recipientDuns = data.recipient.recipient_unique_id;
        }
        if (data.recipient.parent_recipient_unique_id) {
            recipientParentDuns = data.recipient.parent_recipient_unique_id;
        }
        if (data.recipient.business_types_description) {
            recipientBusinessType = data.recipient.business_types_description;
        }
    }
    remappedData.recipient_name = recipientName;
    remappedData.recipient_street = recipientStreet;
    remappedData.recipient_city = recipientCity;
    remappedData.recipient_state_province = recipientStateProvince;
    remappedData.recipient_zip_postal = recipientZipPostal;
    remappedData.recipient_country = recipientCountry;
    remappedData.recipient_duns = recipientDuns;
    remappedData.recipient_parent_duns = recipientParentDuns;
    remappedData.recipient_business_type = recipientBusinessType;

    if (data.type_of_contract_pricing) {
        contractPricingCode = data.type_of_contract_pricing;
    }
    if (data.type_of_contract_pricing_description) {
        contractPricing = data.type_of_contract_pricing_description;
    }

    remappedData.type_of_contract_pricing = contractPricingCode;
    remappedData.type_of_contract_pricing_description = contractPricing;

    // convert the award type code to a user-readable string
    let serverType = '';
    if (data.type_description) {
        serverType = data.type_description;
    }
    remappedData.type = serverType;

    const moneyCells = ['total_obligation', 'potential_total_value_of_award'];
    moneyCells.forEach((cell) => {
        remappedData[cell] = MoneyFormatter.formatMoney(data[cell]);
    });

    // finally parse the moment object
    const dates = ['period_of_performance_start_date', 'period_of_performance_current_end_date',
        'date_signed'];
    dates.forEach((date) => {
        if (data[date]) {
            remappedData[date] = moment(data[date], 'YYYY-MM-DD').format('M/D/YYYY');
        }
        else {
            // handle null dates
            remappedData[date] = '';
        }
    });

    return remappedData;
};

class AwardSummary extends GenericRecord {
    constructor(data, idField = null) {
        const remappedData = remapData(data, idField);
        // create the object
        super(recordType, fields, remappedData);
    }
}

export default AwardSummary;
