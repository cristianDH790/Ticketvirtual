-- Ticket Queue Management (MySQL)
-- Generated: 2026-03-12

CREATE TABLE `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(150) NOT NULL,
  `ventanilla` VARCHAR(50) NULL,
  `login` VARCHAR(80) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `perfil` ENUM('Admin','Agente') NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_usuarios_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `clientes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dni` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('Nuevo','Asignado','Atendido','No Atendido') NOT NULL DEFAULT 'Nuevo',
  `usuario_id` INT UNSIGNED NULL,
  `fecha_asignacion` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_clientes_dni` (`dni`),
  KEY `ix_clientes_estado_fecha` (`estado`, `fecha_registro`),
  KEY `ix_clientes_usuario_estado` (`usuario_id`, `estado`),
  CONSTRAINT `fk_clientes_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

