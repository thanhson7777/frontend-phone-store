import { useEffect, useState, useMemo } from "react";
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
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import {
  getPublishedArticlesAPI,
  getArticlesByCategoryPublicAPI,
} from "~/apis";

const CATEGORY_LABELS = {
  all: { label: "Tất cả" },
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

const SEARCH_DEBOUNCE_MS = 1000;

function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(
      () => setSearchQuery(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        let data;
        if (category === "all") {
          data = await getPublishedArticlesAPI({ limit: 100 });
        } else {
          data = await getArticlesByCategoryPublicAPI(category);
        }
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
  }, [category]);

  const filtered = useMemo(() => {
    if (!searchQuery) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q)),
    );
  }, [articles, searchQuery]);

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, minHeight: "60vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <ArticleIcon color="error" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            Bài viết
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tin tức, đánh giá sản phẩm và hướng dẫn từ cửa hàng
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm theo tiêu đề hoặc mô tả (dừng gõ 1 giây sẽ lọc)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { md: 400 } }}
          />
          <ToggleButtonGroup
            exclusive
            value={category}
            onChange={(_, v) => v != null && setCategory(v)}
            size="small"
            sx={{ flexWrap: "wrap" }}
          >
            {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
              <ToggleButton key={key} value={key}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton sx={{ mt: 1 }} />
                <Skeleton width="50%" />
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ArticleIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">
              {articles.length === 0
                ? "Chưa có bài viết nào được xuất bản."
                : "Không có bài viết phù hợp với từ khóa tìm kiếm."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((article) => {
              const cat =
                CATEGORY_LABELS[article.category] && article.category !== "all"
                  ? CATEGORY_LABELS[article.category]
                  : null;
              const slug = article.slug || article._id;
              return (
                <Grid item xs={12} sm={6} md={4} key={article._id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      overflow: "hidden",
                      transition: "0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    <CardActionArea component={Link} to={`/articles/${slug}`}>
                      {article.thumbnail ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={article.thumbnail}
                          alt={article.title}
                          sx={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            bgcolor: "grey.100",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ArticleIcon
                            sx={{ fontSize: 72, color: "grey.400" }}
                          />
                        </Box>
                      )}
                      <CardContent>
                        {cat && (
                          <Chip
                            label={cat.label}
                            color={cat.color}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <Typography
                          variant="h6"
                          component="h2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {formatDate(article.publishedAt || article.createdAt)}
                          {article.author?.name
                            ? ` · ${article.author.name}`
                            : ""}
                        </Typography>
                        {article.excerpt && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1.5 }}
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
        )}
      </Container>
    </Box>
  );
}

export default ArticlesPage;
