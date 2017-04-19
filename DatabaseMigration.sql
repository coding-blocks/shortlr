--Adding column for email verification

ALTER TABLE urls
ADD emailCheck BOOLEAN NOT NULL DEFAULT FALSE;


