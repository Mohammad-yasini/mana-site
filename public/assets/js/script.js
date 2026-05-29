jQuery(function ($) {
  $(".notifications .toastBox i").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".toastBox").remove();
  });

  $(".referBox .btn-link.gold").on("click", function (e) {
    e.preventDefault();
    var text = $(".referBox .referLink").text().trim();
    var tempInput = $("<input>");
    $("body").append(tempInput);
    tempInput.val(text).select();
    document.execCommand("copy");
    tempInput.remove();
  });

  $(".productDetailSide .addedToCart").slideUp(0);
  $(".productDetailSide .addBtn").on("click", function (e) {
    e.preventDefault();
    let _this = $(this);
    if (_this.closest(".productDetailSide").hasClass("inactive")) {
      return;
    }
    _this.slideUp("normal");
    _this
      .closest(".productDetailSide")
      .find(".addedToCart")
      .slideDown("normal");
  });

  $(".productDetailSide .atcInner .plus").on("click", function (e) {
    e.preventDefault();
    let _this = $(this);
    let numberSec = _this.closest(".atcInner").find(".number");
    numberSec.html(parseInt(numberSec.html()) + 1);
  });

  $(".productDetailSide .atcInner .minus").on("click", function (e) {
    e.preventDefault();
    let _this = $(this);
    let numberSec = _this.closest(".atcInner").find(".number");
    if (parseInt(numberSec.html()) > 0) {
      numberSec.html(parseInt(numberSec.html()) - 1);
      if (parseInt(numberSec.html()) == 0) {
        _this.closest(".productDetailSide").find(".addBtn").slideDown("normal");
        _this
          .closest(".productDetailSide")
          .find(".addedToCart")
          .slideUp("normal");
        numberSec.html(1);
      }
    }
  });

  $(".orderBox .productItem .quantityBox").fadeOut(0);
  $(".orderBox .productItem .editBtn").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".productItem").find(".quantityBox").fadeIn("normal");
  });
  $(".orderBox .productItem .remove").on("click", function (e) {
    e.preventDefault();
    $(this).closest(".quantityBox").fadeOut("normal");
  });

  $(".paymentBox-footer .detailsToggle").on("click", function (e) {
    e.preventDefault();
    $(this)
      .closest(".detailsWarpper")
      .find(".paymentProducts")
      .slideToggle("normal");
  });

  $(".header-left .toggleMenu, .rightDashboard .closeRightDashboard").on(
    "click",
    function (e) {
      e.preventDefault();
      $(".rightDashboard").fadeToggle("normal");
    }
  );

  $(".scoreHistoryBox .scoreHeader").on("click", function (e) {
    $(this)
      .closest(".scoreHistoryBox")
      .find(".scoreList")
      .slideToggle("normal");
  });

  // Initialize: Show answers for items that are already active
  $(".faqItem.active .answer").show();
  
  // Handle click on FAQ questions
  $(".faqItem .question").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    const $parent = $(this).closest(".faqItem");
    const $answer = $parent.find(".answer");
    const isCurrentlyActive = $parent.hasClass("active");
    
    // Toggle active class
    $parent.toggleClass("active");
    
    // Toggle answer visibility with animation
    if (isCurrentlyActive) {
      // Closing: slide up then ensure hidden
      $answer.slideUp(300, function() {
        $(this).hide();
      });
    } else {
      // Opening: ensure visible then slide down
      $answer.hide().slideDown(300);
    }
  });

  $(".copyLinkBtn").on("click", function (e) {
    e.preventDefault();
    var $this = $(this);
    // Find the input in the same wrapper
    var $input = $this.closest(".referralLinkWrapper").find("#referralLinkInput");
    var $icon = $this.find(".copyLinkIcon");
    var linkText = $input.val();
    
    if (!linkText) {
      console.error("Input value is empty");
      return;
    }
    
    // Function to show success feedback
    function showSuccess() {
      $icon.removeClass("ri-file-copy-line").addClass("ri-checkbox-circle-line");
      setTimeout(function() {
        $icon.removeClass("ri-checkbox-circle-line").addClass("ri-file-copy-line");
      }, 2000);
    }
    
    // Try modern Clipboard API first (works in HTTPS or localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linkText).then(function() {
        showSuccess();
      }).catch(function(err) {
        console.error("Clipboard API failed, trying fallback:", err);
        // Fallback to execCommand
        fallbackCopy();
      });
    } else {
      // Fallback for older browsers or non-HTTPS
      fallbackCopy();
    }
    
    function fallbackCopy() {
      // Create temporary input for copying
      var tempInput = $("<input>");
      $("body").append(tempInput);
      tempInput.val(linkText).select();
      
      try {
        var successful = document.execCommand("copy");
        if (successful) {
          showSuccess();
        } else {
          console.error("execCommand copy failed");
        }
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
      
      tempInput.remove();
    }
  });

  // Handle file upload button click
  $(".profileUploadBtn.flexDCol").on("click", function(e) {
    e.preventDefault();
    var $container = $(this).closest(".profileDocumentsPreview, .profilePictureSection");
    var $input = $container.find(".profileUploadInput").first();
    if ($input.length) {
      $input.trigger("click");
    }
  });

  // Handle file input change - show file name
  $(".profileUploadInput").on("change", function() {
    var fileName = "";
    if (this.files && this.files.length > 0) {
      fileName = this.files[0].name;
    }
    var $container = $(this).closest(".profileDocumentsPreview, .profilePictureSection");
    var $fileNameSpan = $container.find(".profileFileName");
    if (fileName) {
      $fileNameSpan.text(fileName);
    } else {
      $fileNameSpan.text("");
    }
  });
});
