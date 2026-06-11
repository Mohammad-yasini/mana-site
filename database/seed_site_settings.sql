INSERT INTO `site_settings_config` (`id`, `config_json`) VALUES (1, '{"faviconUrl":null}')
ON DUPLICATE KEY UPDATE `id` = `id`;
