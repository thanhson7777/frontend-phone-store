import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { getPublishedArticlesAPI } from "~/apis";

const CATEGORY_LABELS = {
  news: { label: "Tin tức", color: "info" },
  review: { label: "Review", color: "warning" },
  guide: { label: "Hướng dẫn", color: "success" },
  tips: { label: "Tips", color: "secondary" },
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getPublishedArticlesAPI({ limit: 4 });
        if (!cancelled && Array.isArray(data)) setArticles(data);
        else if (!cancelled) setArticles([]);
      } catch {
        if (!cancelled) setArticles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#f8f9fc" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ArticleIcon color="error" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Tin & bài viết
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cập nhật xu hướng, review và mẹo sử dụng điện thoại
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to="/articles"
            endIcon={<ArrowForwardIcon />}
            color="error"
            variant="outlined"
          >
            Xem tất cả
          </Button>
        </Box>

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton sx={{ mt: 1 }} />
                  <Skeleton width="60%" />
                </Grid>
              ))
            : articles.map((article) => {
                const cat =
                  CATEGORY_LABELS[article.category] || CATEGORY_LABELS.news;
                const slug = article.slug || article._id;
                return (
                  <Grid item xs={12} sm={6} md={3} key={article._id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        transition: "box-shadow 0.2s, transform 0.2s",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <CardActionArea component={Link} to={`/articles/${slug}`}>
                        {article.thumbnail ? (
                          <CardMedia
                            component="img"
                            height="160"
                            image={article.thumbnail}
                            alt={article.title}
                            sx={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 160,
                              bgcolor: "error.light",
                              opacity: 0.15,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ArticleIcon
                              sx={{
                                fontSize: 64,
                                color: "error.main",
                                opacity: 0.5,
                              }}
                            />
                          </Box>
                        )}
                        <CardContent>
                          <Chip
                            label={cat.label}
                            color={cat.color}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                            noWrap
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {formatDate(
                              article.publishedAt || article.createdAt,
                            )}
                          </Typography>
                          {article.excerpt && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {article.excerpt}
                            </Typography>
                          )}
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>
      </Container>
    </Box>
  );
}

export default ArticleSection;
