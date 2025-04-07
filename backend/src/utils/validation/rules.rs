use once_cell::sync::Lazy;
use regex::Regex;

// パターン
pub static EMAIL_REGEX: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap());

pub static PASSWORD_SPECIAL_CHARS: &str = "!@#$%^&*(),.?\":{}|<>";

/// バリデーションルールの定数
pub struct ValidationRules;

impl ValidationRules {
    // 文字数制限
    pub const NAME_MIN_LENGTH: usize = 3;
    pub const NAME_MAX_LENGTH: usize = 20;
    pub const PASSWORD_MIN_LENGTH: usize = 8;
    pub const PASSWORD_MAX_LENGTH: usize = 100;
    pub const EMAIL_MAX_LENGTH: usize = 255;

    // カスタムルール
    pub fn is_valid_name(name: &str) -> bool {
        name.chars()
            .all(|c| c.is_alphanumeric() || c == '_' || c == '-')
    }
}
