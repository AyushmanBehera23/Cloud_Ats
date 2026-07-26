CREATE TABLE IF NOT EXISTS notification_schema.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL,
    type        VARCHAR(30)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT,
    is_read     BOOLEAN DEFAULT false,
    channel     VARCHAR(10) DEFAULT 'IN_APP',
    status      VARCHAR(10) DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at     TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notification_schema.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notification_schema.notifications(user_id, is_read);
