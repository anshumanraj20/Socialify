import { Button, Card, Link, Stack, Typography } from "@mui/material";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { MdSettingsInputAntenna } from "react-icons/md";
import { useLocation, useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import CreatePost from "./CreatePost";
import Loading from "./Loading";
import PostCard from "./PostCard";
import SortBySelect from "./SortBySelect";
import HorizontalStack from "./util/HorizontalStack";

const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();

  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
    };

    let data;

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;
      if (searchExists) query.search = search.get("search");

      data = await getPosts(user && user.token, query);
    } else if (props.contentType === "liked") {
      data = await getUserLikedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    if (data.data.length < 10) {
      setEnd(true);
    }

    setLoading(false);
    if (!data.error) {
      setPosts([...posts, ...data.data]);
      setCount(data.count);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [search]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return (
  
<div style={{ color: "light blue", border: "1px solid green", borderRadius: "50px", boxShadow: "0px 0px 10px " }}>
  <Stack spacing={2} sx={{ backgroundColor: '#f0f0f0', borderRadius: '50px' }}>
    <Card sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '50px', boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)" }}>
      <HorizontalStack justifyContent="space-between">
        {props.createPost && <CreatePost />}
        <SortBySelect
          onSortBy={handleSortBy}
          sortBy={sortBy}
          sorts={sorts}
          sx={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)", border: '1px solid green' }}
        />
      </HorizontalStack>
    </Card>

    {searchExists && (
      <Box sx={{ backgroundColor: 'white', padding: '10px', border: "1px solid green", borderRadius: '5px', boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h5" gutterBottom>
          Showing results for "{search.get("search")}"
        </Typography>
        <Typography color="text.secondary" variant="span">
          {count} results found
        </Typography>
      </Box>
    )}

    {posts.map((post, i) => (
      <PostCard
        preview="primary"
        key={post._id}
        post={post}
        removePost={removePost}
        sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '10px', boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)", border: '1px solid green' }}
      />
    ))}

    {loading && <Loading />}
    {end ? (
      <Stack py={5} alignItems="center">
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {posts.length > 0 ? (
            <>All posts have been viewed</>
          ) : (
            <>No posts available</>
          )}
        </Typography>
        <Button variant="text" size="small" onClick={handleBackToTop} sx={{ color: 'green' }}>
          Back to top
        </Button>
      </Stack>
    ) : (
      !loading &&
      posts &&
      posts.length > 0 && (
        <Stack pt={2} pb={6} alignItems="center" spacing={2}>
          <Button onClick={fetchPosts} variant="contained" sx={{ backgroundColor: 'green', color: 'white', boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.1)", border: '1px solid green' }}>
            Load more
          </Button>
          <Button variant="text" size="small" onClick={handleBackToTop} sx={{ color: 'green' }}>
            Back to top
          </Button>
        </Stack>
      )
    )}
  </Stack>
</div>





  );
};

export default PostBrowser;
