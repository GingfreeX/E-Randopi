<?php

namespace ShopBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Vich\UploaderBundle\Form\Type\VichImageType;
class ProductAddForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('titre',TextType::class,array('label' => 'Titre de Produit', 'attr' => array('class' => 'form-control','style' =>"border: 1px solid #cccccc;border-radius: 4px;")))
            ->add('prix',IntegerType::class,array('label' => 'prix de produit', 'attr' => array('class' => 'form-control','style' =>"border: 1px solid #cccccc;border-radius: 4px;")))
            ->add('description',TextareaType::class,array('label' => 'Description', 'attr' => array('class' => 'form-control','style' =>"border: 1px solid #cccccc;border-radius: 4px;")))
            ->add('imageFile',VichImageType::class,array('label' => 'Image', 'attr' => array('class' => 'form-control','style' =>"border: 1px solid #cccccc;border-radius: 4px;")))
            ->add('Add',SubmitType::class,array('attr' => array('class' => 'btn btn-success','style' =>"margin-top: 20px;")))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {

    }

    public function getName()
    {
        return 'shop_bundle_product_add_form';
    }
}
