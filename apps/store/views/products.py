from django.views.generic import ListView, DetailView, TemplateView
from django.db.models import Q
from apps.store.models import Item, Variation

class HomeView(ListView):
    model = Item
    template_name = "home.html"
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().order_by('order', '-created_at')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            ).distinct()
        return queryset


class CategoryListView(TemplateView):
    template_name = 'category_list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['product_types'] = [
            ('shirt', 'Shirt'),
            ('polo-tshirt', 'Polo Tshirt'),
            ('tshirt', 'Tshirt'),
            ('punjabi', 'Punjabi'),
            ('pant', 'Pant'),
            ('footware', 'Footware'),
            ('lifestyle', 'Lifestyle'),
        ]
        return context


class CategoryProductListView(ListView):
    model = Item
    template_name = 'category_products.html'
    context_object_name = 'object_list'
    paginate_by = 20

    def get_queryset(self):
        queryset = Item.objects.filter(product_type=self.kwargs['product_type']).order_by('order', '-created_at')
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        categories = dict([
            ('shirt', 'Shirt'),
            ('polo-tshirt', 'Polo Tshirt'),
            ('tshirt', 'Tshirt'),
            ('punjabi', 'Punjabi'),
            ('pant', 'Pant'),
            ('footware', 'Footware'),
            ('lifestyle', 'Lifestyle'),
        ])
        context['category_label'] = categories.get(self.kwargs['product_type'], '')
        return context


class NewArrivalsView(ListView):
    model = Item
    template_name = 'new_arrivals.html'
    context_object_name = 'object_list'
    paginate_by = 20

    def get_queryset(self):
        return Item.objects.filter(label='P').order_by('-created_at')


class ProductDetailView(DetailView):
    model = Item
    template_name = "product.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        product = self.get_object()
        has_sizes = Variation.objects.filter(
            item=product, 
            name__iexact="size",
            itemvariation__isnull=False
        ).exists()
        context['has_sizes'] = has_sizes
        return context
