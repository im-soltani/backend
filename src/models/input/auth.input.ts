const UserLoginInput = {
  email: {
    notEmpty: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};
const UserLinkedInLoginInput = {
  email: {
    notEmpty: true,
    isEmail: true,
  },
};

const AdminRegisterInput = {
  email: {
    notEmpty: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};

const CandidatRegisterInput = {
  first_name: {
    notEmpty: true,
  },
  last_name: {
    notEmpty: true,
  },
  email: {
    notEmpty: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
};

const EntrepriseRegisterInput = {
  name: {
    notEmpty: true,
  },
  company_id: {
    notEmpty: true,
  },
  email: {
    notEmpty: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
  tel: {
    notEmpty: true,
  },
  address: {
    notEmpty: true,
  },
  country: {
    notEmpty: true,
  },
  city: {
    notEmpty: true,
  },
  zip_code: {
    notEmpty: true,
  },
};

const DeliveryManRegisterInput = {
  first_name: {
    notEmpty: true,
  },
  last_name: {
    notEmpty: true,
  },
  email: {
    notEmpty: true,
    isEmail: true,
  },
  password: {
    notEmpty: true,
  },
  tel: {
    notEmpty: true,
  },
};

export {
  UserLoginInput,
  AdminRegisterInput,
  CandidatRegisterInput,
  EntrepriseRegisterInput,
  DeliveryManRegisterInput,
  UserLinkedInLoginInput,
};
