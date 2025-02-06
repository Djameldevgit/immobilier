import React from 'react';
import PostCard from '../PostCard';
import LoadMoreBtn from '../LoadMoreBtn';

const CategoryCard = ({ category, posts, theme, handleLoadMore, load }) => {
    return (
        <div className="category-card">
            <h3>{category.name}</h3>
            <div className="posts">
                {posts.slice(0, 3).map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))}
            </div>

            <LoadMoreBtn
                result={posts.length}
                load={load}
                handleLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default CategoryCard;
