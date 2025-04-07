use super::errors::ValidationError;
use super::rules::{ValidationRules, EMAIL_REGEX, PASSWORD_SPECIAL_CHARS};

pub struct Validator;

impl Validator {
    // 必須バリデーション
    pub fn validate_required(value: &str) -> Result<(), ValidationError> {
        if value.trim().is_empty() {
            return Err(ValidationError::Required);
        }
        Ok(())
    }

    // メールアドレスバリデーション
    pub fn validate_email(email: &str) -> Result<(), ValidationError> {
        if !EMAIL_REGEX.is_match(email) {
            return Err(ValidationError::InvalidEmail);
        }
        if email.len() > ValidationRules::EMAIL_MAX_LENGTH {
            return Err(ValidationError::TooLong(ValidationRules::EMAIL_MAX_LENGTH));
        }
        Ok(())
    }

    // 名前バリデーション
    pub fn validate_name(name: &str) -> Result<(), ValidationError> {
        if name.len() < ValidationRules::NAME_MIN_LENGTH {
            return Err(ValidationError::TooShort(ValidationRules::NAME_MIN_LENGTH));
        }
        if name.len() > ValidationRules::NAME_MAX_LENGTH {
            return Err(ValidationError::TooLong(ValidationRules::NAME_MAX_LENGTH));
        }
        if !ValidationRules::is_valid_name(name) {
            return Err(ValidationError::InvalidNameFormat);
        }
        Ok(())
    }

    // パスワードバリデーション
    pub fn validate_password(password: &str) -> Vec<ValidationError> {
        let mut errors = Vec::new();

        if password.len() < ValidationRules::PASSWORD_MIN_LENGTH {
            errors.push(ValidationError::TooShort(
                ValidationRules::PASSWORD_MIN_LENGTH,
            ));
        }
        if password.len() > ValidationRules::PASSWORD_MAX_LENGTH {
            errors.push(ValidationError::TooLong(
                ValidationRules::PASSWORD_MAX_LENGTH,
            ));
        }
        if !password.chars().any(|c| c.is_ascii_lowercase()) {
            errors.push(ValidationError::PasswordMissingLower);
        }
        if !password.chars().any(|c| c.is_ascii_uppercase()) {
            errors.push(ValidationError::PasswordMissingUpper);
        }
        if !password.chars().any(|c| c.is_ascii_digit()) {
            errors.push(ValidationError::PasswordMissingNumber);
        }
        if !password.chars().any(|c| PASSWORD_SPECIAL_CHARS.contains(c)) {
            errors.push(ValidationError::PasswordMissingSymbol);
        }

        errors
    }
}
