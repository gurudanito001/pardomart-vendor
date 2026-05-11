import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import type { ListRenderItem } from "react-native";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProducts } from "@/hooks/api/useProducts";
import { useVendor } from "@/hooks/api/useVendors";
import { borderRadius, colors, shadows, spacing, typography } from "@/styles/theme";
import { toast } from "sonner-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_CARD_MAX_WIDTH = 360;
const IMAGE_CARD_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, IMAGE_CARD_MAX_WIDTH);

type HeaderProps = {
  onBack: () => void;
  onNotifications: () => void;
};

function Header({ onBack, onNotifications }: HeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <View style={styles.backIconContainer}>
            <Ionicons name="chevron-back" size={20} color={colors.surface} />
          </View>
        </Pressable>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <Pressable
        onPress={onNotifications}
        style={styles.notificationButton}
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
      >
        <Ionicons name="notifications-outline" size={22} color={colors.surface} />
      </Pressable>
    </View>
  );
}

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    productId?: string;
    vendorId?: string;
  }>();
  const productId = params?.productId as string | undefined;

  const { getProductById, deleteProduct } = useProducts();
  const { vendor, getVendorById } = useVendor();

  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [modalIndex, setModalIndex] = React.useState(0);

  const carouselRef = React.useRef<FlatList<string | null>>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (productId) {
          const fetchedProduct = await getProductById(productId);
          if (mounted) {
            setProduct(fetchedProduct as any);
          }
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId, getProductById]);

  React.useEffect(() => {
    const vendorId =
      params?.vendorId ||
      (product as any)?.vendorId ||
      (product as any)?.vendor?.id;
    if (vendorId && !vendor?.id) {
      getVendorById(vendorId).catch(() => {});
    }
  }, [product, params?.vendorId, vendor, getVendorById]);

  React.useEffect(() => {
    setCurrentIndex(0);
    setModalIndex(0);
    setModalVisible(false);
  }, [productId]);

  const imageSources = React.useMemo<string[]>(() => {
    const fromArray = Array.isArray(product?.images)
      ? (product?.images ?? []).filter(
          (img: unknown): img is string => typeof img === "string" && img.trim().length > 0
        )
      : [];

    if (fromArray.length > 0) {
      return fromArray;
    }

    const fallbackImage = typeof product?.image === "string" && product.image.trim().length > 0 ? product.image : null;
    return fallbackImage ? [fallbackImage] : [];
  }, [product]);

  const carouselData = imageSources.length > 0 ? imageSources : [null];
  const hasMultipleImages = imageSources.length > 1;

  const priceValue = React.useMemo(() => {
    const raw = product?.price;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const parsed = parseFloat(raw);
      if (Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }, [product]);

  const discountedPriceValue = React.useMemo(() => {
    const raw = product?.discountedPrice;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const parsed = parseFloat(raw);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  }, [product]);

  const productDescription = React.useMemo(() => {
    const description = typeof product?.description === "string" ? product.description.trim() : "";
    return description.length > 0 ? description : "No description has been provided for this product yet.";
  }, [product]);

  const productWeight = React.useMemo(() => {
    if (product?.weight == null) return null;
    return `${product.weight}${product.weightUnit ? ` ${product.weightUnit}` : ""}`;
  }, [product]);

  const productMeta = React.useMemo(
    () =>
      [
        { label: "Unit Size", value: product?.unitSize },
        { label: "SKU", value: product?.sku },
        { label: "Weight", value: productWeight },
        { label: "EBT Eligible", value: product?.isEbtEligible ? "Yes" : "No" },
        {
          label: "Category",
          value: (product?.category as any)?.name ?? product?.categoryName ?? product?.category ?? null,
        },
        { label: "Vendor", value: vendor?.name ?? (product?.vendor as any)?.name ?? null },
      ].filter((item) => item.value != null && String(item.value).trim().length > 0),
    [product, vendor, productWeight]
  );

  const handleMomentumEnd = React.useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  const openModalAt = React.useCallback(
    (index: number) => {
      if (!imageSources[index]) return;
      setModalIndex(index);
      setModalVisible(true);
    },
    [imageSources]
  );

  const closeModal = React.useCallback(() => {
    setModalVisible(false);
    if (imageSources.length > 0) {
      setCurrentIndex(modalIndex);
      requestAnimationFrame(() => {
        if (carouselRef.current && modalIndex < carouselData.length) {
          try {
            carouselRef.current.scrollToIndex({ index: modalIndex, animated: true });
          } catch (error) {
            // ignore scroll errors if index is out of range
          }
        }
      });
    }
  }, [modalIndex, imageSources.length, carouselData.length]);

  const goToPrevious = React.useCallback(() => {
    setModalIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToNext = React.useCallback(() => {
    setModalIndex((prev) => Math.min(prev + 1, imageSources.length - 1));
  }, [imageSources.length]);

  const openEdit = React.useCallback(() => {
    if (!product) return;
    router.push({
      pathname: "/(private)/store/edit-product",
      params: { productId: product.id, storeId: params?.vendorId },
    } as never);
  }, [router, product, params?.vendorId]);

  const handleDeleteProduct = React.useCallback(async () => {
    if (!productId) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success("Product deleted successfully");
        router.back();
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeleteModalVisible(false);
    }
  }, [productId, deleteProduct, router]);

  const openNotifications = React.useCallback(() => {
    router.push("/(private)/shared/notifications" as never);
  }, [router]);

  const reportIssue = React.useCallback(() => {
    const pid = product?.id || productId;
    if (!pid) return;
    router.push({
      pathname: "/(private)/help/reportIssue",
      params: { productId: pid, category: 'PRODUCT_ISSUE' },
    } as never);
  }, [router, product, productId]);

  const renderCarouselItem: ListRenderItem<string | null> = ({ item, index }) => (
    <Pressable
      key={index}
      onPress={() => openModalAt(index)}
      disabled={!item}
      style={[styles.carouselItem, { width: SCREEN_WIDTH }]}
    >
      <View style={[
        styles.carouselImageCard, 
        { width: SCREEN_WIDTH - (spacing.lg * 2) }
      ]}> 
        {item ? (
          <Image
            style={styles.productImage}
            contentFit="contain"
            source={{ uri: item }}
            accessibilityRole="image"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={40} color={colors.primaryMuted} />
            <Text style={styles.placeholderText}>No product images yet</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  if (loading)
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );

  if (error || !product)
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.errorText}>{error ?? "Product not found"}</Text>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primary }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.headerWrapper}>
        <Header onBack={() => router.back()} onNotifications={openNotifications} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          <FlatList
            ref={carouselRef}
            data={carouselData}
            keyExtractor={(item, index) => `${item ?? "placeholder"}-${index}`}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
          />

          {imageSources.length > 1 && (
            <View style={styles.carouselIndicators}>
              {imageSources.map((_, index) => (
                <View
                  key={index}
                  style={[styles.carouselDot, index === currentIndex && styles.carouselDotActive]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.productInfoCard}>
          <View style={styles.productHeader}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productTitle}>{product?.name ?? "Unnamed Product"}</Text>
              {product?.unitSize || productWeight ? (
                <Text style={styles.productSubtitle}>
                  {productWeight || product.unitSize}
                </Text>
              ) : null}
            </View>
            <View style={styles.priceContainer}>
              {discountedPriceValue !== null ? (
                <>
                  <Text style={styles.priceAmount}>${discountedPriceValue.toFixed(2)}</Text>
                  <Text style={styles.originalPriceCanceled}>${priceValue.toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.priceAmount}>${priceValue.toFixed(2)}</Text>
              )}
            </View>
          </View>

          {typeof product?.stock === "number" || typeof product?.quantityAvailable === "number" ? (
            <View style={styles.inventoryRow}>
              <View style={[styles.statusDot, { backgroundColor: (product?.stock ?? 0) > 0 ? colors.success : colors.error }]} />
              <Text style={styles.inventoryText}>
                In stock: {product?.stock ?? product?.quantityAvailable}
              </Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          {productMeta.length > 0 && (
            <View style={styles.specificationsContainer}>
              <Text style={styles.specTitle}>Specifications</Text>
              {productMeta.map((item) => (
                <View key={item.label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{item.label}</Text>
                  <Text 
                    style={styles.specValue} 
                    numberOfLines={1} 
                    ellipsizeMode="tail"
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.reportIssueContainer}>
          <Pressable style={styles.reportIssueButton} onPress={reportIssue} accessibilityRole="button">
            <Ionicons name="warning-outline" size={20} color={colors.error} />
            <Text style={styles.reportIssueText}>Report an issue</Text>
          </Pressable>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.productDescription}>{productDescription}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <Pressable style={[styles.primaryButton, { flex: 1 }]} onPress={openEdit} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Edit Product</Text>
        </Pressable>
        <Pressable 
          style={styles.deleteButton} 
          onPress={() => setDeleteModalVisible(true)} 
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalCloseButton} onPress={closeModal} accessibilityLabel="Close image viewer">
              <Ionicons name="close" size={22} color={colors.surface} />
            </Pressable>

            <View style={styles.modalImageSection}>
              {imageSources[modalIndex] ? (
                <Image
                  style={styles.modalImage}
                  source={{ uri: imageSources[modalIndex] as string }}
                  contentFit="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image" size={46} color={colors.surface} />
                  <Text style={[styles.placeholderText, { color: colors.surface }]}>No image available</Text>
                </View>
              )}
            </View>

            {hasMultipleImages && (
              <View style={styles.modalControls}>
                <Pressable
                  onPress={goToPrevious}
                  style={[styles.modalArrowButton, modalIndex === 0 && styles.modalArrowButtonDisabled]}
                  disabled={modalIndex === 0}
                >
                  <Ionicons name="chevron-back" size={22} color={colors.surface} />
                </Pressable>

                <Text style={styles.modalCounter}>
                  {modalIndex + 1} / {imageSources.length}
                </Text>

                <Pressable
                  onPress={goToNext}
                  style={[
                    styles.modalArrowButton,
                    modalIndex === imageSources.length - 1 && styles.modalArrowButtonDisabled,
                  ]}
                  disabled={modalIndex === imageSources.length - 1}
                >
                  <Ionicons name="chevron-forward" size={22} color={colors.surface} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconCircle}>
              <Ionicons name="trash" size={30} color={colors.error} />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Product?</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete "{product?.name}"? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalActions}>
              <Pressable 
                style={styles.cancelModalButton} 
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.confirmDeleteButton} 
                onPress={handleDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing["3xl"],
    paddingTop: spacing.xl,
  },
  headerWrapper: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    ...shadows.md,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  backButton: {
    padding: 4,
  },
  backIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  imageSection: {
    marginTop: -spacing.lg,
  },
  carouselItem: {
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImageCard: {
    height: 300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...shadows.md,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  placeholderText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontFamily: typography.families.secondary,
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryMuted,
  },
  carouselDotActive: {
    width: 16,
    backgroundColor: colors.primary,
  },
  productInfoCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    gap: spacing.lg,
    ...shadows.sm,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  productTitleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  productTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
  },
  priceContainer: {
    alignItems: "flex-end",
    gap: 2,
  },
  originalPriceCanceled: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  productSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textMuted,
  },
  priceAmount: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  inventoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inventoryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  specificationsContainer: {
    gap: spacing.sm,
  },
  specTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  specLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontFamily: typography.families.secondary,
    flex: 1,
  },
  specValue: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    flex: 2,
    textAlign: "right",
  },
  reportIssueContainer: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  reportIssueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundLight,
    gap: spacing.sm,
  },
  reportIssueText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.families.secondary,
    color: colors.error,
  },
  descriptionCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  productDescription: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textSecondary,
    lineHeight: typography.sizes.base,
  },
  bottomActionContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  deleteButton: {
    width: 55,
    height: 55,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  deleteModalContent: {
    width: "85%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },
  deleteIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(233, 68, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  deleteModalTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  deleteModalMessage: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  deleteModalActions: {
    flexDirection: "row",
    width: "100%",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelModalButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmDeleteButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    fontFamily: typography.families.secondary,
  },
  errorText: {
    fontSize: typography.sizes.base,
    color: colors.error,
    fontFamily: typography.families.accent,
    textAlign: "center",
  },
  secondaryButton: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary,
    fontFamily: typography.families.accent,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 420,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImageSection: {
    height: 260,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalArrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalArrowButtonDisabled: {
    backgroundColor: colors.primaryMuted,
  },
  modalCounter: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
  },
});
