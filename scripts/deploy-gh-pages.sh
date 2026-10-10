#!/bin/bash
set -e

echo "🚀 Building CloudATS frontend for production..."
cd frontend
npm run build
cp dist/index.html dist/404.html
cd ..

echo "📦 Committing dist tree to gh-pages branch..."
git add -f frontend/dist
TREE_ID=$(git write-tree --prefix=frontend/dist)
COMMIT_ID=$(git commit-tree $TREE_ID -m "Deploy CloudATS frontend to GitHub Pages [$(date '+%Y-%m-%d %H:%M:%S')]")
git reset HEAD frontend/dist
git branch -f gh-pages $COMMIT_ID

echo "🌐 Pushing to GitHub (origin/gh-pages)..."
git push origin gh-pages --force

echo "✅ Successfully deployed to GitHub Pages!"
