"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserLoginInput = {
    email: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    }
};
exports.UserLoginInput = UserLoginInput;
const AdminRegisterInput = {
    email: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    }
};
exports.AdminRegisterInput = AdminRegisterInput;
const CandidatRegisterInput = {
    first_name: {
        notEmpty: true,
    },
    last_name: {
        notEmpty: true
    },
    email: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    },
    tel: {
        notEmpty: true
    }
};
exports.CandidatRegisterInput = CandidatRegisterInput;
const EntrepriseRegisterInput = {
    name: {
        notEmpty: true,
    },
    email: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    },
    tel: {
        notEmpty: true
    },
    address: {
        notEmpty: true
    },
    country: {
        notEmpty: true
    },
    city: {
        notEmpty: true
    },
    zip_code: {
        notEmpty: true
    }
};
exports.EntrepriseRegisterInput = EntrepriseRegisterInput;
const DeliveryManRegisterInput = {
    first_name: {
        notEmpty: true,
    },
    last_name: {
        notEmpty: true,
    },
    email: {
        notEmpty: true,
        isEmail: true
    },
    password: {
        notEmpty: true
    },
    tel: {
        notEmpty: true
    }
};
exports.DeliveryManRegisterInput = DeliveryManRegisterInput;
//# sourceMappingURL=auth.input.js.map