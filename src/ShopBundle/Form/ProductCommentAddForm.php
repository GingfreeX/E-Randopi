<?php

namespace ShopBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductCommentAddForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
   $builder
       ->add('description',TextareaType::class,array('attr' => array('cols' => '30','rows' =>"4")))
       ->add('productid',HiddenType::class)
       ->add('userid',HiddenType::class)
       ->add('Submit',SubmitType::class,array('attr' => array('type' => 'submit')))
       ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {

    }

    public function getName()
    {
        return 'shop_bundle_product_comment_add_form';
    }
}
