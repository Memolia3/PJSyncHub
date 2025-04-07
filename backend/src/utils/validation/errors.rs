use thiserror::Error;

#[derive(Error, Debug)]
pub enum ValidationError {
    #[error("required")]
    Required,
    #[error("tooShort.{0}")]
    TooShort(usize),
    #[error("tooLong.{0}")]
    TooLong(usize),
    #[error("invalidEmail")]
    InvalidEmail,
    #[error("passwordMissingLower")]
    PasswordMissingLower,
    #[error("passwordMissingUpper")]
    PasswordMissingUpper,
    #[error("passwordMissingNumber")]
    PasswordMissingNumber,
    #[error("passwordMissingSymbol")]
    PasswordMissingSymbol,
    #[error("invalidNameFormat")]
    InvalidNameFormat,
}
