---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 全局异常处理
# 当前页面内容描述
description: 全局异常处理，处理可预见的异常
# 是否在侧边栏或目录中索引当前页面
index: true
# 当前页面是否开启评论功能
comment: true
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# 是否显示页面最后更新时间
lastUpdated: true
# 是否显示编辑链接
editLink: true
# 是否显示贡献者
contributors: true
# 指定当前页面在侧边栏或目录中的排序
order: 10
dir:
  order: 10
# 页面图标
icon: "catppuccin:java-exception"
# 是否原创
isOriginal: false
# 日期
date: 2025-02-08
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 指南
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 全局异常处理

::: info
Java 后端的运行时异常如果直接抛到前端就是一些堆栈信息，有些时候会暴露很多敏感信息，比如数据库表字段结构或者一些查询语句里面的敏感数据等等，全局的异常拦截就很有必要，可以处理可预见的异常
:::

```java
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalRestExceptionTranslator {

    /**
     * 记录请求的异常
     */
    final IGlobalExceptionReporter globalExceptionReporter;

    /**
     * 把异常如何抛出
     */
    final IGlobalPrinter globalExceptionPrinter;

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<?> handleError(MissingServletRequestParameterException e) {
        log.warn("缺少请求参数:{}", e.getMessage());
        String message = "缺少必要的请求参数: " + e.getParameterName();
        return R.fail(ResultCode.VALIDATE_ERROR.getCode(), message);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<?> handleError(MethodArgumentTypeMismatchException e) {
        log.warn("请求参数格式错误:{}", e.getMessage());
        String message = "请求参数格式错误: " + e.getName();
        return R.fail(ResultCode.VALIDATE_ERROR.getCode(), message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<?> handleError(MethodArgumentNotValidException e) {
        log.warn("参数验证失败:{}", e.getMessage());
        return handleError(e.getBindingResult());
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<?> handleError(BindException e) {
        log.warn("参数绑定失败:{}", e.getMessage());
        return handleError(e.getBindingResult());
    }

    private R<?> handleError(BindingResult result) {
        FieldError error = result.getFieldError();
        if (Objects.nonNull(error)) {
            String message = error.getField() + ":" + error.getDefaultMessage();
            return R.fail(ResultCode.VALIDATE_ERROR.getCode(), message);
        }
        return R.fail(ResultCode.VALIDATE_ERROR);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<?> handleError(HandlerMethodValidationException e) {
        List<String> messageList = e.getAllErrors().stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .map(s -> "【" + s + "】")
                .toList();
        return R.fail(ResultCode.VALIDATE_ERROR.getCode(), "请求参数验证失败：" + CollectionUtil.join(messageList, ","));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public R<?> handleError(HttpMessageNotReadableException e) {
        return R.fail(ResultCode.ERROR.getCode()
                , Optional.ofNullable(e.getRootCause()).map(Throwable::getMessage).orElse(e.getMessage()));
    }


    /**
     * 最后找不到是什么异常再被这里拦截
     *
     * @param e        异常
     * @param request  请求
     * @param response 响应
     */
    @ExceptionHandler(Throwable.class)
    public void UnknownException(Throwable e
            , HttpServletRequest request
            , HttpServletResponse response) {
        // 记录日志
        globalExceptionReporter.recording(request, e);
        // 抛出异常
        globalExceptionPrinter.print(e, response);
    }
}
```

如果还有其他可预见的异常，可以在后面继续添加
