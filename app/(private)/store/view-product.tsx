import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProducts } from "@/hooks/api/useProducts";
import { useVendor } from "@/hooks/api/useVendors";
import { borderRadius, colors, shadows, spacing, typography } from "@/styles/theme";

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

  const { getProductById } = useProducts();
  const { vendor, getVendorById } = useVendor();

  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
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

  const productDescription = React.useMemo(() => {
    const description = typeof product?.description === "string" ? product.description.trim() : "";
    return description.length > 0 ? description : "No description has been provided for this product yet.";
  }, [product]);

  const productMeta = React.useMemo(
    () =>
      [
        { label: "Unit Size", value: product?.unitSize },
        { label: "SKU", value: product?.sku },
        {
          label: "Category",
          value: (product?.category as any)?.name ?? product?.categoryName ?? product?.category ?? null,
        },
        { label: "Vendor", value: vendor?.name ?? (product?.vendor as any)?.name ?? null },
      ].filter((item) => typeof item.value === "string" && item.value.trim().length > 0),
    [product, vendor]
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

  const openNotifications = React.useCallback(() => {
    router.push("/(private)/shared/notifications" as never);
  }, [router]);

  const renderCarouselItem: ListRenderItem<string | null> = ({ item, index }) => (
    <Pressable
      key={index}
      onPress={() => openModalAt(index)}
      disabled={!item}
      style={[styles.carouselItem, { width: SCREEN_WIDTH }]}
    >
      <View style={[styles.carouselImageCard, { width: IMAGE_CARD_WIDTH }]}> 
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.headerWrapper}>
        <Header onBack={() => router.back()} onNotifications={openNotifications} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
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
              {product?.unitSize ? (
                <Text style={styles.productSubtitle}>{product.unitSize}</Text>
              ) : null}
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceAmount}>${priceValue.toFixed(2)}</Text>
              {product?.unitSize ? (
                <Text style={styles.priceHint}>per {product.unitSize}</Text>
              ) : null}
            </View>
          </View>

          {typeof product?.stock === "number" || typeof product?.quantityAvailable === "number" ? (
            <View style={styles.inventoryRow}>
              <Ionicons name="cube-outline" size={18} color={colors.primary} />
              <Text style={styles.inventoryText}>
                In stock: {product?.stock ?? product?.quantityAvailable}
              </Text>
            </View>
          ) : null}

          {productMeta.length > 0 && (
            <View style={styles.metaChipsContainer}>
              {productMeta.map((item) => (
                <View key={item.label} style={styles.metaChip}>
                  <Text style={styles.metaChipLabel}>{item.label}</Text>
                  <Text style={styles.metaChipValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.productDescription}>{productDescription}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActionContainer}>
        <Pressable style={styles.primaryButton} onPress={openEdit} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Edit Product</Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
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
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImageCard: {
    height: 250,
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
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    gap: spacing.md,
    ...shadows.md,
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
  productSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textMuted,
  },
  priceBadge: {
    alignItems: "flex-end",
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    minWidth: 110,
  },
  priceAmount: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.accent,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  priceHint: {
    fontSize: typography.sizes.xs,
    color: "rgba(255,255,255,0.8)",
    fontFamily: typography.families.secondary,
    marginTop: spacing.xs / 2,
  },
  inventoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  inventoryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.secondary,
    color: colors.textSecondary,
  },
  metaChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
  },
  metaChipLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontFamily: typography.families.secondary,
  },
  metaChipValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.accent,
    color: colors.textPrimary,
    marginTop: spacing.xs / 2,
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
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
