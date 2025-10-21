CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL,
    author VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);