import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";

const LoadingSkeleton: React.FC = () => {
  return (
    <Stack spacing={2} useFlexGap>
      <Card variant="outlined" sx={{ width: "100%", boxShadow: 4 }}>
        {" "}
        {/* 카드 너비를 전체로 설정 */}
        <CardContent orientation="horizontal">
          <Skeleton
            animation="wave"
            variant="circular"
            width={48}
            height={48}
          />
          <div>
            <Skeleton animation="wave" variant="text" sx={{ width: "100%" }} />{" "}
            {/* 텍스트 너비 전체 */}
            <Skeleton
              animation="wave"
              variant="text"
              sx={{ width: "100%" }}
            />{" "}
            {/* 텍스트 너비 전체 */}
          </div>
        </CardContent>
        <AspectRatio ratio="21/9">
          <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{ width: "100%" }}
          >
            <img
              alt=""
              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
            />
          </Skeleton>
        </AspectRatio>
        <Typography sx={{ overflow: "hidden" }}>
          <Skeleton animation="wave">
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries.
          </Skeleton>
        </Typography>
        <Button fullWidth>
          {" "}
          {/* 버튼 너비 전체 */}
          Read more
          <Skeleton animation="wave" />
        </Button>
      </Card>
    </Stack>
  );
};

export default LoadingSkeleton;
