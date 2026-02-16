export const interceptorLoadingElement = (calling) => {
  // dom lấy tất cả phần tử có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API thì làm mờ phần tử và chặn click
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none' // Sửa: thêm "s" vào pointerEvents
    } else {
      // Ngược lại thì gán chuỗi rỗng để xóa inline style, trả lại trạng thái ban đầu
      elements[i].style.opacity = ''
      elements[i].style.pointerEvents = ''
    }
  }
}